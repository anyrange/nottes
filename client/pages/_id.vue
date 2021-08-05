<template>
  <main class="h-main">
    <template v-if="passwordRequired">
      <h1 class="h-title">Password required</h1>
      <form class="flex flex-row gap-3" @submit.prevent="getPasteWithPassword()">
        <base-input v-model="password" placeholder="Password" type="password" />
        <base-button aria-label="get paste" color="primary" type="submit" :disabled="!password"> Submit </base-button>
      </form>
    </template>
    <template v-else>
      <div class="paste-content" :class="{ 'paste-content-fullscreen': fullscreen }">
        <div class="flex flex-col gap-y-3 md:flex-row justify-between items-start">
          <div class="flex flex-row gap-2">
            <badge>
              <template #icon>
                <icon-code />
              </template>
              {{ paste.code }}
            </badge>
            <badge>
              <template #icon>
                <icon-view />
              </template>
              {{ paste.views }}
            </badge>
          </div>
          <div class="flex flex-col md:text-center">
            <span class="text-base font-semibold">{{ paste.title }}</span>
            <span class="text-gray-500 dark:text-gray-500-spotify">
              By
              <nuxt-link
                :class="[paste.author.username === 'Guest' ? 'pointer-events-none' : 'link hover:underline']"
                :to="`/user/${paste.author.username}`"
              >
                {{ paste.author.username }}
              </nuxt-link>
              at
              {{ $defaultDateTime(paste.date) }}
            </span>
          </div>
          <div class="flex flex-row gap-2">
            <a :href="`/raw/${paste._id}`">
              <i title="Raw Paste">
                <icon-document class="tool-icon" />
              </i>
            </a>
            <i title="Download Paste">
              <icon-download class="tool-icon" />
            </i>
            <i title="Embed Paste">
              <icon-embed class="tool-icon" />
            </i>
            <i title="Fullscreen" @click="fullscreen = !fullscreen">
              <icon-fullscreen class="tool-icon" />
            </i>
          </div>
        </div>
        <div class="flex-none">
          <code class="">{{ paste.content }}</code>
        </div>
      </div>
    </template>
  </main>
</template>

<script>
import { getPaste } from '@/api'

export default {
  async asyncData({ route, params, error }) {
    try {
      const { paste } = await getPaste({ id: params.id })
      return { paste }
    } catch (err) {
      if (err.response.data.statusCode === 403) return { passwordRequired: true }
      error(err.response.data)
    }
  },
  data() {
    return {
      password: '',
      paste: {},
      passwordRequired: false,
      fullscreen: false,
    }
  },
  head() {
    const title = this.paste.title || 'nottes'
    const description = 'nottes-description'
    return {
      title,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
    }
  },
  methods: {
    async getPasteWithPassword() {
      try {
        const res = await getPaste({ id: this.$route.params.id, password: this.password })
        this.paste = res.paste
        this.passwordRequired = false
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