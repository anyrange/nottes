<template>
  <main class="h-main">
    <div class="flex flex-row gap-3 items-center">
      <img
        v-if="user.avatar"
        class="avatar w-22 h-22 flex-none"
        :src="user.avatar"
        :alt="user.username"
      />
      <div class="flex flex-col">
        <h1 class="h-title">{{ user.username }}</h1>
        <h2>Joined: {{ $formattedDate(user.registered) }}</h2>
      </div>
    </div>
    <div>
      <h3 class="text-lg font-medium">Statistics:</h3>
      <ul>
        <li>Total Pastes: {{ user.stats.total }}</li>
        <li>Total views of all your pastes: {{ user.stats.views }}</li>
        <li>Public pastes: {{ user.stats.public }}</li>
        <li>Unlisted pastes: {{ user.stats.unlisted }}</li>
        <li>Private pastes: {{ user.stats.private }}</li>
      </ul>
    </div>
  </main>
</template>

<script>
import { getUserPage } from '@/api'

export default {
  async asyncData({ route, params, error }) {
    try {
      const { user, pastes } = await getUserPage(params.username)
      return { user, pastes }
    } catch (err) {
      error(err.response.data)
    }
  },
  data() {
    return {
      user: {},
      pastes: [],
    }
  },
  head() {
    const title = this.user.username || 'nottes'
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
}
</script>
