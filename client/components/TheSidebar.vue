<template>
  <aside class="flex flex-col gap-3">
    <h1 class="h-title">Recent Pastes</h1>
    <div class="flex flex-col gap-3">
      <div v-for="paste in pastes" :key="paste.id" class="flex items-center justify-between">
        <div class="flex flex-col w-full">
          <nuxt-link class="link truncate w-11/12" :to="'/' + paste.id">
            {{ paste.title }}
          </nuxt-link>
          <div class="text-xs">
            <span>by </span>
            <template v-if="paste.author.username !== 'Guest'">
              <nuxt-link class="hover:underline" :to="'/user/' + paste.author.username">
                <i>{{ paste.author.username }}</i>
              </nuxt-link>
            </template>
            <template v-else>
              <i>{{ paste.author.username }}</i>
            </template>
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
      pastes: [],
    }
  },
  mounted() {
    const evtStream = new EventSource(`${process.env.baseUrl}/api/pastes/recent`)
    const pastes = this.pastes

    evtStream.onmessage = (event) => {
      const { data: paste } = JSON.parse(event.data)
      pastes.push(paste)
      if (pastes.length > 10) pastes.pop()
    }

    evtStream.onerror = (err) => {
      console.error('EventSource failed:', err)
      evtStream.close()
    }
  },
}
</script>
