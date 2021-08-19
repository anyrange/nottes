<template>
  <aside class="flex flex-col gap-4">
    <div v-if="authenticated" class="flex flex-col gap-4">
      <h1 class="h-title">Hello, {{ user.username }}</h1>
      <transition-group v-if="!!userPastes.length" tag="div" name="list" class="flex flex-col gap-2">
        <div v-for="paste in userPastes" :key="paste._id" class="flex flex-row gap-2 items-center justify-between">
          <nuxt-link class="w-auto link truncate" :to="'/' + paste._id">
            {{ paste.title }}
          </nuxt-link>
          <span class="w-auto cursor-pointer" @click="deletePaste(paste._id)">
            <icon-trash class="icon w-5 h-5" />
          </span>
        </div>
      </transition-group>
      <div v-else>
        <i>No pastes</i>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <h1 class="h-title">Recent Pastes</h1>
      <transition-group v-if="pastes.length" tag="div" name="list" class="flex flex-col gap-3">
        <div
          v-for="paste in pastes"
          :key="paste._id"
          class="transition-transform duration-1000 flex flex-row gap-2 items-center justify-between"
        >
          <div class="w-auto flex flex-col truncate">
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
              <span>|</span>
              <timer class="text-xs" :time="paste.date" />
            </div>
          </div>
          <div class="w-auto flex flex-row gap-4 items-center">
            <client-only>
              <span
                v-if="paste.author.username === user.username"
                class="cursor-pointer"
                @click="deletePaste(paste._id)"
              >
                <icon-trash class="icon w-5 h-5" />
              </span>
            </client-only>
          </div>
        </div>
      </transition-group>
      <div v-else>
        <i>No pastes</i>
      </div>
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
  USER_PASTES_AMOUNT: 6,
  AUTHORIZED_PASTES_AMOUNT: 12,
  UNAUTHORIZED_PASTES_AMOUNT: 15,
  async fetch() {
    try {
      const { pastes } = await getRecentPastes({ range: this.recentPastesAmount })
      this.pastes = pastes
      if (this.authenticated) {
        const { pastes } = await getUserRecentPastes({ range: this.$options.USER_PASTES_AMOUNT })
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
    recentPastesAmount() {
      return this.authenticated ? this.$options.AUTHORIZED_PASTES_AMOUNT : this.$options.UNAUTHORIZED_PASTES_AMOUNT
    },
  },
  watch: {
    authenticated() {
      this.$fetch()
    },
    pastes(val) {
      if (val.length > this.$options.UNAUTHORIZED_PASTES_AMOUNT) this.pastes.pop()
    },
    userPastes(val) {
      if (val.length > this.$options.USER_PASTES_AMOUNT) this.userPastes.pop()
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
          case 'insert': {
            const paste = message.paste

            if (paste.visibility !== 'unlisted' && paste.visibility !== 'private') this.pastes.unshift(paste)
            paste.author.username === this.user.username && this.userPastes.unshift(paste)
            break
          }
          case 'update': {
            const paste = message.paste
            const updatedPasteIndex = this.pastes.findIndex((item) => item._id === paste._id)

            Object.assign(this.pastes[updatedPasteIndex], paste)
            break
          }
          case 'delete': {
            const paste = message.paste
            const pasteToDelete = (element) => element._id !== paste._id

            this.pastes = this.pastes.filter(pasteToDelete)
            this.userPastes = this.userPastes.filter(pasteToDelete)
            break
          }
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
