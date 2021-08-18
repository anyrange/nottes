<template>
  <main class="h-main">
    <div class="flex flex-row gap-3 items-center">
      <img v-if="user.avatar" class="avatar w-22 h-22 flex-none" :src="user.avatar" :alt="user.username" />
      <div class="flex flex-col">
        <h1 class="text-2xl font-normal">{{ user.username }}</h1>
        <h2 class="secondary-text">Joined: {{ $formattedDate(user.registered) }}</h2>
      </div>
    </div>
    <div class="w-full flex flex-wrap gap-4">
      <card :content="stats.total">pastes</card>
      <card :content="stats.views">views</card>
      <card :content="stats.contributions">contributions</card>
      <card :content="stats.public">public pastes</card>
      <card :content="stats.unlisted">unlisted pastes</card>
      <card :content="stats.private">private pastes</card>
      <card :content="stats.shared">shared pastes</card>
    </div>
  </main>
</template>

<script>
import { getUserPage } from '@/api'

export default {
  async asyncData({ route, params, error }) {
    try {
      const { user, pastes, stats } = await getUserPage(params.username)
      return { user, pastes, stats }
    } catch (err) {
      error(err.response.data)
    }
  },
  data() {
    return {
      user: {},
      pastes: [],
      stats: {},
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
