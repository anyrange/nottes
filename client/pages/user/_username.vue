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
}
</script>
