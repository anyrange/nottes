<template>
  <main class="h-main">
    <div class="flex flex-row gap-3 items-center">
      <img v-if="user.avatar" class="avatar w-22 h-22 flex-none" :src="user.avatar" :alt="user.username" />
      <div class="flex flex-col">
        <h1 class="text-2xl font-normal">{{ user.username }}</h1>
        <h2 class="secondary-text">Joined: {{ $formattedDate(user.registered) }}</h2>
      </div>
    </div>
    <div class="w-full flex flex-wrap gap-2">
      <badge>
        pastes:
        <strong>{{ stats.total }}</strong>
      </badge>
      <badge>
        views:
        <strong>{{ stats.views }}</strong>
      </badge>
      <badge>
        contributions:
        <strong>{{ stats.contributions }}</strong>
      </badge>
      <badge>
        shared pastes:
        <strong>{{ stats.shared }}</strong>
      </badge>
      <badge>
        public pastes:
        <strong>{{ stats.public }}</strong>
      </badge>
      <badge>
        unlisted pastes:
        <strong>{{ stats.unlisted }}</strong>
      </badge>
      <badge>
        private pastes:
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
