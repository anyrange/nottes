<template>
  <aside class="flex flex-col gap-4">
    <h1 class="h-title">Recent Pastes</h1>
    <transition-group tag="div" name="list" class="flex flex-col gap-3">
      <div v-for="paste in pastes" :key="paste._id" class="flex flex-row gap-2 items-center justify-between">
        <div class="flex flex-col w-9/12 truncate">
          <nuxt-link class="link truncate" :to="'/' + paste._id">
            {{ paste.title }}
          </nuxt-link>
          <div class="text-xs truncate">
            <span>by</span>
            <nuxt-link
              :class="[paste.author.username === 'Guest' ? 'pointer-events-none' : 'hover:underline']"
              :to="'/user/' + paste.author.username || 'Guest'"
            >
              <i>{{ paste.author.username }}</i>
            </nuxt-link>
          </div>
        </div>
        <div class="flex flex-row gap-3 items-center w-auto">
          <span v-tooltip:bottom-left="$timePassedFrom(paste.date)">
            <fa :icon="['far', 'clock']" />
          </span>
        </div>
      </div>
    </transition-group>
  </aside>
</template>

<script>
import { deletePaste } from '@/api'

export default {
  name: 'TheSidebar',
  data() {
    return {
      pastes: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  mounted() {
    this.connectToWs()
  },
  methods: {
    connectToWs() {
      const wsProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws'
      const socket = new WebSocket(`${wsProtocol}://${window.location.host}/api/pastes/recent`)
      socket.onopen = (event) => {
        this.pastes = []
        console.log('WebSocket is open now.', event)
      }
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        switch (message.event) {
          case 'insert':
            this.pastes.unshift(message.paste)
            if (this.pastes.length > 10) this.pastes.pop()
            break
          case 'delete':
            this.pastes = this.pastes.filter((el) => el._id !== message.paste._id)
            break
          default:
            break
        }
      }
      socket.onerror = (err) => {
        console.error('Socket encountered error: ', err.message, 'Closing socket')
        socket.close()
      }
      socket.onclose = (event) => {
        setTimeout(() => {
          this.connectToWs()
        }, 1000)
        console.log('WebSocket error observed:', event)
      }
    },
    async deletePaste(id) {
      try {
        await deletePaste(id)
      } catch (error) {
        this.$store.dispatch('notify/addNotification', {
          message: error.response.data.message,
          type: 'danger',
        })
      }
    },
  },
}
</script>
