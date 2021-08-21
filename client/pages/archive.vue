<template>
  <main class="h-main">
    <h1 class="h-title">Pastes Archive</h1>
    <div class="w-full flex flex-wrap gap-2">
      <badge>
        <span>shared pastes</span>
        <strong>{{ stats.shared }}</strong>
      </badge>
      <badge>
        <span>public pastes</span>
        <strong>{{ stats.public }}</strong>
      </badge>
      <badge>
        <span>unlisted pastes</span>
        <strong>{{ stats.unlisted }}</strong>
      </badge>
      <badge>
        <span>private pastes</span>
        <strong>{{ stats.private }}</strong>
      </badge>
    </div>
    <div class="flex flex-col gap-3">
      <div class="flex">
        <base-input
          v-model="search"
          name="search-value"
          label="Search"
          type="search"
          autocomplete="off"
          placeholder="Search Query"
        />
      </div>
      <div>
        <div class="row font-semibold border-b default-border">
          <button class="row__title" @click="toggle('title')">
            Title
            <component :is="arrow.direction" v-if="arrow.title === 'title'" class="icon w-5 h-5" />
          </button>
          <button class="row__created" @click="toggle('date')">
            Created
            <component :is="arrow.direction" v-if="arrow.title === 'date'" class="icon w-5 h-5" />
          </button>
          <button class="row__syntax" @click="toggle('code')">
            <component :is="arrow.direction" v-if="arrow.title === 'code'" class="icon w-5 h-5" />
            Syntax
          </button>
        </div>
        <div class="overflow-y-auto fullwidth">
          <div class="flex flex-col divide-y default-divide">
            <div v-if="!pastes.length && search && !loading" class="row w-full justify-center">
              No matching records found
            </div>
            <div
              v-for="(paste, index) in loading ? parseInt(range) : pastes"
              :key="index"
              :class="{ 'animate-pulse': loading }"
              class="row hover:bg-gray-50 dark:hover:bg-gray-700-spotify"
            >
              <template v-if="loading">
                <div>&nbsp;</div>
              </template>
              <template v-else>
                <div class="row__title">
                  <nuxt-link class="link" :to="`/${paste._id}`">{{ paste.title }}</nuxt-link>
                </div>
                <span :title="paste.date" class="row__created secondary-text">
                  {{ $formatDistanceToNow(paste.date) }}
                </span>
                <span class="row__syntax secondary-text">{{ paste.code }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <span>
          Showing {{ fromEntries }} to
          {{ toEntries }}
          of {{ entries }} entries
        </span>
        <div class="flex gap-2">
          <base-select v-model="range" :options="$options.rangeOptions" size="small" />
          <pagination
            :total-pages="pages"
            :max-visible-buttons="3"
            :current-page="parseInt(page)"
            @pagechanged="onPageChange"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { getArchive } from '@/api'
import rangeOptions from '@/services/options/rangeOptions.json'

export default {
  data() {
    return {
      loading: true,
      pastes: [],
      stats: {},
      pages: 0,
      entries: 0,
      range: 10,
      page: 1,
      search: '',
      sort: 'date',
    }
  },
  rangeOptions,
  head() {
    const title = 'Pastes Archive'
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
      ],
    }
  },
  computed: {
    pageStateOptions() {
      return {
        search: this.search,
        page: this.page,
        sort: this.sort,
        range: this.range,
      }
    },
    fromEntries() {
      return this.entries ? (this.page - 1) * parseInt(this.range) + 1 : 0
    },
    toEntries() {
      const range = parseInt(this.range)
      const maxEntries = (this.page - 1) * range + range
      return maxEntries < this.entries ? maxEntries : this.entries
    },
    arrow() {
      if (!this.sort) return { title: '' }
      const isDescending = this.sort.charAt(0) === '-'
      return {
        direction: isDescending ? 'icon-arrow-down' : 'icon-arrow-up',
        title: isDescending ? this.sort.substring(1) : this.sort,
      }
    },
  },
  watch: {
    sort() {
      this.page = 1
    },
    search() {
      this.page = 1
    },
    $route: {
      handler({ query: { page, search, sort, range } }) {
        this.page = page || this.page
        this.search = search || this.search
        this.sort = sort || this.sort
        this.range = range || this.range
      },
      immediate: true,
    },
    pageStateOptions: {
      async handler({ range, page, search, sort }) {
        const queryParams = { range, page, search, sort }
        this.$router.push({ path: this.$route.path, query: queryParams })
        await this.loadArchive(queryParams)
      },
      immediate: true,
    },
  },
  methods: {
    async loadArchive(params) {
      try {
        this.loading = true
        this.pastes = []
        const { pastes, pages, entries, stats } = await getArchive(params)
        this.pastes = pastes
        this.pages = pages
        this.entries = entries
        this.stats = stats
      } catch (error) {
        this.$notify.show({
          message: error.response.data.message,
          type: 'danger',
        })
      } finally {
        this.loading = false
      }
    },
    toggle(title) {
      this.sort = this.sort === title ? `-${title}` : this.sort === `-${title}` ? '' : title
    },
    onPageChange(page) {
      this.page = page
    },
  },
}
</script>

<style lang="postcss">
.row {
  @apply truncate flex flex-row gap-3 items-center w-full h-10 px-4;
}
.row__title {
  @apply w-full flex items-center;
}
.row__created {
  @apply w-1/3 flex items-center justify-start;
}
.row__syntax {
  @apply w-1/6 hidden sm:flex items-center justify-end;
}
</style>