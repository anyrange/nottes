<template>
  <aside class="flex flex-col gap-3">
    <h1 class="h-title">Recent Pastes</h1>
    <div class="flex flex-col">
      <div v-for="paste in pastes" :key="paste.id" class="flex items-center justify-between">
        <div class="flex flex-col">
          <nuxt-link class="link" :to="'/' + paste.id">
            {{ paste.name }}
          </nuxt-link>
          <div class="text-xs">
            <span>by </span>
            <nuxt-link class="hover:underline" :to="'/user/' + paste.author.username">
              <i>{{ paste.author.username }}</i>
            </nuxt-link>
          </div>
        </div>
        <span v-tooltip:bottom-left="$timePassedFrom(paste.date)">
          <fa :icon="['far', 'clock']" />
        </span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'TheSidebar',
  data() {
    return {
      pastes: [
        {
          id: '1',
          name: 'pastes',
          author: {
            username: 'string',
            avatar: 'string',
          },
          date: '2021-07-20T16:13:58.109Z',
        },
      ],
    }
  },
}
</script>
