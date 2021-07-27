<template>
  <main class="h-main">
    <h1 class="h-title">{{ paste.title || 'Password required' }}</h1>
    <template v-if="passwordRequired || false">
      <form class="flex flex-row gap-3" @submit.prevent="getPasteWithPassword()">
        <base-input v-model="password" placeholder="Password" type="password" />
        <base-button aria-label="get paste" color="primary" type="submit" label="Submit" :disabled="!password" />
      </form>
    </template>
    <template v-else>
      <div class="flex-none">
        <code class="block whitespace-pre">{{ paste.content }}</code>
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