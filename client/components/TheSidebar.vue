<template>
  <aside class="flex flex-col gap-4">
    <div v-if="authenticated" class="flex flex-col gap-4">
      <h1 class="h-title">Hello, {{ user.username }}</h1>
      <transition-group tag="div" name="list" class="flex flex-col gap-3">
        <div v-for="paste in userPastes" :key="paste._id" class="flex flex-row gap-2 items-center justify-between">
          <div class="flex flex-col w-9/12 truncate">
            <nuxt-link class="link truncate" :to="'/' + paste._id">
              {{ paste.title }}
            </nuxt-link>
          </div>
          <div class="flex flex-row gap-4 items-center w-auto">
            <client-only>
              <span class="cursor-pointer" @click="deletePaste(paste._id)">
                <fa :icon="['far', 'trash-alt']" />
              </span>
            </client-only>
            <span v-tooltip:bottom-left="$timePassedFrom(paste.date)">
              <fa :icon="['far', 'clock']" />
            </span>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="flex flex-col gap-4">
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
          <div class="flex flex-row gap-4 items-center w-auto">
            <client-only>
              <span
                v-if="paste.author.username === user.username"
                class="cursor-pointer"
                @click="deletePaste(paste._id)"
              >
                <fa :icon="['far', 'trash-alt']" />
              </span>
            </client-only>
            <span v-tooltip:bottom-left="$timePassedFrom(paste.date)">
              <fa :icon="['far', 'clock']" />
            </span>
          </div>
        </div>
      </transition-group>
    </div>
  </aside>
</template>

<script>
import { deletePaste, getRecentPastes, getUserRecentPastes } from '@/api'

export default {
  name: 'TheSidebar',
  data() {
    return {
      pastes: [],
      userPastes: [],
      socketState: '',
    }
  },
  async fetch() {
    try {
      const { pastes } = await getRecentPastes()
      this.pastes = pastes.reverse()
      if (this.authenticated) {
        const { pastes } = await getUserRecentPastes()
        this.userPastes = pastes
      }
    } catch (err) {
      this.$notify.show({
        message: err.response.data.message,
        type: 'danger',
      })
    }
  },
  computed: {
    authenticated() {
      return this.$store.state.authenticated
    },
    user() {
      return this.$store.state.user.profile
    },
  },
  mounted() {
    this.connectToWs()
  },
  methods: {
    connectToWs() {
      const url = window.location
      const wsProtocol = url.protocol.includes('https') ? 'wss' : 'ws'
      const socket = new WebSocket(`${wsProtocol}://${url.host}/api/pastes/recent`)
      socket.onopen = ({ type }) => {
        this.socketState = type
      }
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        switch (message.event) {
          case 'insert':
            this.pastes.unshift(message.paste)
            if (message.paste.author.username === this.user.username) {
              this.userPastes.unshift(message.paste)
            }
            if (this.userPastes.length > 7) this.userPastes.pop()
            if (this.pastes.length > 12) this.pastes.pop()
            break
          case 'delete':
            this.pastes = this.pastes.filter((el) => el._id !== message.paste._id)
            this.userPastes = this.userPastes.filter((el) => el._id !== message.paste._id)
            break
          default:
            break
        }
      }
      socket.onerror = ({ type }) => {
        this.socketState = type
        socket.close()
      }
      socket.onclose = () => {
        setTimeout(() => {
          this.connectToWs()
        }, 1000)
      }
    },
    async deletePaste(id) {
      try {
        await deletePaste(id)
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
