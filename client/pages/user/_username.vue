<template>
  <main class="h-main">
    <div class="flex flex-row gap-3 items-center">
      <img v-if="user.avatar" class="avatar w-22 h-22 flex-none" :src="user.avatar" :alt="user.username" />
      <div class="flex flex-col">
        <h1 class="text-2xl font-normal">{{ user.username }}</h1>
        <h2 class="secondary-text">Joined: {{ $defaultDate(user.registered) }}</h2>
      </div>
    </div>
    <div class="w-full flex flex-wrap gap-2">
      <badge>
        <span>pastes</span>
        <strong>{{ stats.total }}</strong>
      </badge>
      <badge>
        <span>views</span>
        <strong>{{ stats.views }}</strong>
      </badge>
      <badge>
        <span>contributions</span>
        <strong>{{ stats.contributions }}</strong>
      </badge>
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
          @input="page = 1"
        />
      </div>
      <div>
        <div class="row border-b default-border">
          <button class="row__title" @click="toggle('title')">
            Title
            <component :is="arrow.direction" v-if="arrow.title === 'title'" class="icon w-5 h-5" />
          </button>
          <button class="row__created" @click="toggle('date')">
            <component :is="arrow.direction" v-if="arrow.title === 'date'" class="icon w-5 h-5" />
            Created
          </button>
          <button class="row__visibility" @click="toggle('visibility')">
            <component :is="arrow.direction" v-if="arrow.title === 'visibility'" class="icon w-5 h-5" />
            Visibility
          </button>
          <button class="row__views" @click="toggle('views')">
            Views
            <component :is="arrow.direction" v-if="arrow.title === 'views'" class="icon w-5 h-5" />
          </button>
          <button class="row__syntax" @click="toggle('code')">
            <component :is="arrow.direction" v-if="arrow.title === 'code'" class="icon w-5 h-5" />
            Syntax
          </button>
          <span class="row__delete">Delete</span>
        </div>
        <div class="overflow-y-auto fullwidth">
          <div class="flex flex-col divide-y default-divide">
            <div v-if="!pastes.length && search && !loading" class="row w-full justify-center">
              No matching records found
            </div>
            <div
              v-for="(paste, index) in loading ? range : pastes"
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
                <span class="row__visibility secondary-text">
                  {{ paste.visibility }}
                </span>
                <span class="row__views secondary-text">
                  {{ paste.views || 0 }}
                </span>
                <span class="row__syntax secondary-text">{{ paste.code }}</span>
                <button class="row__delete secondary-text" @click="deletePaste(paste._id)">
                  <icon-trash class="icon w-6 h-6" />
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <entries :page="page" :entries="entries" :range="range" />
        <div class="flex gap-2">
          <base-select v-model="range" :options="$options.rangeOptions" size="small" />
          <pagination v-model="page" :total-pages="pages" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { getUserPage, getUserPastes, deletePaste } from '@/api'
import archive from '@/mixins.js/archive.js'

export default {
  mixins: [archive],
  async asyncData({ route, params, error }) {
    try {
      const { user, stats } = await getUserPage(params.username)
      return { user, stats }
    } catch (err) {
      error(err.response.data)
    }
  },
  data() {
    return {
      loading: true,
      user: {},
      stats: {},
      pastes: [],
      pages: 0,
      entries: 0,
    }
  },
  async fetch() {
    await this.loadUserPastes(this.pageStateOptions)
  },
  head() {
    const title = `${this.user.username}'s pastes`
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'profile',
        },
      ],
    }
  },
  methods: {
    async loadUserPastes(params) {
      try {
        this.loading = true
        this.pastes = []
        const { pastes, pages, entries } = await getUserPastes(this.user.username, params)
        this.pastes = pastes
        this.pages = pages
        this.entries = entries
      } catch (error) {
        this.$notify.show({
          message: error.response.data.message,
          type: 'danger',
        })
      } finally {
        this.loading = false
      }
    },
    async deletePaste(id) {
      try {
        await deletePaste(id)
        await this.$fetch()
      } catch (err) {
        this.$notify.show({
          message: err.response.data.message,
          type: 'danger',
        })
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
.row {
  @apply truncate flex flex-row gap-3 items-center w-full h-10 px-4;
}
.row__title {
  @apply w-full flex items-center;
}
.row__created {
  @apply w-full flex items-center justify-start;
}
.row__visibility {
  @apply w-full hidden sm:flex items-center justify-center;
}
.row__views {
  @apply w-full hidden sm:flex items-center justify-center;
}
.row__syntax {
  @apply w-full hidden sm:flex items-center justify-end;
}
.row__delete {
  @apply w-full hidden sm:flex justify-end;
}
</style>