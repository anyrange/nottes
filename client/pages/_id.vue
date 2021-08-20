<template>
  <main class="h-main">
    <template v-if="passwordRequired">
      <h1 class="h-title">Password required</h1>
      <form class="flex flex-row gap-3" @submit.prevent="getPasteWithPassword()">
        <base-input v-model="password" placeholder="Password" type="password" />
        <base-button aria-label="get paste" color="primary" type="submit" :disabled="!password"> Submit </base-button>
      </form>
    </template>
    <template v-else>
      <div class="default-background flex flex-col gap-3" :class="{ 'paste-content-fullscreen': fullscreen }">
        <div>
          <p>
            <span class="text-base font-semibold">
              {{ paste.title }}
            </span>
            <span class="secondary-text">by</span>
            <nuxt-link
              :class="[paste.author.username === 'Guest' ? 'pointer-events-none' : 'link']"
              :to="`/user/${paste.author.username}`"
              >{{ paste.author.username }}</nuxt-link
            >
            <span class="secondary-text">at {{ $defaultDateTime(paste.date) }}</span>
          </p>
          <p v-if="paste.contributors.length">
            <span class="secondary-text">contributors</span>
            <span v-for="(contributor, index) in paste.contributors" :key="contributor.username" class="truncate">
              <nuxt-link :to="`/user/${contributor.username}`" class="link">{{ contributor.username }}</nuxt-link
              ><span v-if="index !== paste.contributors.length - 1">,&nbsp;</span>
            </span>
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 justify-between sticky top-0 z-50 rounded default-background">
          <div class="flex flex-row flex-wrap gap-2">
            <badge title="Visibility">
              <template #icon>
                <icon-lock />
              </template>
              <span>{{ paste.visibility }}</span>
            </badge>
            <badge title="Views">
              <template #icon>
                <icon-eye />
              </template>
              <span>{{ paste.views }}</span>
            </badge>
            <badge title="Language">
              <template #icon>
                <icon-code />
              </template>
              <span>{{ paste.code }}</span>
            </badge>
            <badge v-if="paste.date" :title="`Created at ${$defaultDateTime(paste.date)}`">
              <template #icon>
                <icon-date />
              </template>
              <timer :time="paste.date" />
            </badge>
            <badge v-if="paste.expire_date" :title="`Expires at ${$defaultDateTime(paste.expire_date)}`">
              <template #icon>
                <icon-updated />
              </template>
              <timer :time="paste.expire_date" />
            </badge>
          </div>
          <div class="flex flex-row flex-wrap gap-2">
            <template v-if="canEditPaste">
              <button v-show="showDiff" title="Split" @click="split = !split">
                <component :is="split ? 'icon-split-horizontal' : 'icon-split-vertical'" class="tool-icon" />
              </button>
              <button title="View Diff" @click="showDiff = !showDiff">
                <icon-gradient class="tool-icon" />
              </button>
              <button title="Edit Paste" @click="editing = !editing">
                <icon-edit class="tool-icon" />
              </button>
            </template>
            <button v-if="authenticated" title="Fork Paste" @click="forkPaste()">
              <icon-fork class="tool-icon" />
            </button>
            <a :href="`/raw/${paste._id}`">
              <i title="Raw Paste">
                <icon-document class="tool-icon" />
              </i>
            </a>
            <a :href="`/raw/${paste._id}`" download>
              <i title="Download Paste">
                <icon-download class="tool-icon" />
              </i>
            </a>
            <button title="Fullscreen" @click="fullscreen = !fullscreen">
              <icon-fullscreen class="tool-icon" />
            </button>
          </div>
        </div>
        <div class="flex" :class="[split ? 'flex-row' : 'flex-col']">
          <component
            :is="editing ? 'code-editor' : 'code-highlight'"
            v-model="pasteClone.content"
            :code="pasteClone.content"
            :language="pasteClone.code"
          />
          <code-highlight
            v-if="showDiff"
            :code="
              getCodeDiff({
                title: paste.title,
                to: outdated ? paste.content : pasteClone.content,
                from: outdated ? pasteClone.content : paste.content,
              })
            "
            language="diff"
          />
        </div>
        <div v-if="editing && isAuthor" class="paste-control-head">
          <base-input
            v-model="pasteClone.title"
            label="Title"
            name="paste-title"
            autocomplete="off"
            placeholder="Paste Title"
          />
          <base-select v-model="pasteClone.code" label="Language" :options="$options.languageOptions" />
        </div>
        <div v-if="editing" class="paste-control-footer">
          <base-select
            v-if="isAuthor"
            v-model="pasteClone.expiry"
            class="md:w-1/3 w-full"
            :options="$options.expirationOptions"
            label="Expiration"
          />
          <base-select
            v-if="isAuthor"
            v-model="pasteClone.visibility"
            class="md:w-1/3 w-full"
            :options="$options.visibilityOptions({ authenticated })"
            label="Visibility"
          />
          <base-input
            v-if="isAuthor"
            v-model="newPassword"
            :disabled="isContributor"
            type="password"
            autocomplete="off"
            placeholder="New password"
          />
          <base-button
            :disabled="outdated"
            color="primary"
            class="md:order-1 order-2 ml-auto"
            aria-label="edit paste"
            @click="updatePaste()"
          >
            Update
          </base-button>
        </div>
      </div>
    </template>
  </main>
</template>

<script>
import { getPaste, forkPaste, editPaste } from '@/api'
import languageOptions from '@/services/options/languageOptions.json'
import expirationOptions from '@/services/options/expirationOptions.json'
import visibilityOptions from '@/services/options/visibilityOptions.js'
import { getCodeDiff } from '@/utils/diff.js'

export default {
  async asyncData({ route, params, error }) {
    try {
      const { paste } = await getPaste({ id: params.id })
      const pasteClone = { ...paste }
      return { paste, pasteClone }
    } catch (err) {
      if (err.response.data.statusCode === 403) return { passwordRequired: true }
      error(err.response.data)
    }
  },
  data() {
    return {
      password: '',
      passwordRequired: false,
      paste: {},
      pasteClone: {},
      newPassword: '',
      fullscreen: false,
      outdated: false,
      editing: false,
      split: true,
      showDiff: false,
      socketState: '',
    }
  },
  languageOptions,
  expirationOptions,
  visibilityOptions,
  head() {
    const title = this.paste.title
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
          content: 'article',
        },
      ],
    }
  },
  computed: {
    authenticated() {
      return this.$store.state.authenticated
    },
    user() {
      return this.$store.state.user.profile
    },
    isShared() {
      return this.paste.visibility === 'shared'
    },
    isAuthor() {
      return this.paste.author.username === this.user.username
    },
    isContributor() {
      return !this.isAuthor && this.isShared
    },
    canEditPaste() {
      return (
        this.paste.author.username === this.user.username || (this.paste.visibility === 'shared' && this.authenticated)
      )
    },
  },
  mounted() {
    if (!this.passwordRequired) this.connectToWs()
  },
  methods: {
    getCodeDiff,
    connectToWs() {
      const url = window.location
      const wsProtocol = url.protocol.includes('https') ? 'wss' : 'ws'
      const socket = new WebSocket(`${wsProtocol}://${url.host}/api/pastes/${this.paste._id}?password=${this.password}`)
      socket.onopen = ({ type }) => {
        this.socketState = type
      }
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        switch (message.event) {
          case 'update': {
            const paste = message.paste

            Object.assign(this.paste, paste)

            if (!(this.paste.content === this.pasteClone.content)) {
              this.outdated = true
              this.$notify.show({
                message: 'Paste content has been updated',
                type: 'info',
                progress: false,
                closable: false,
                unique: true,
                actions: [
                  {
                    title: 'Accept changes',
                    handler: () => {
                      Object.assign(this.pasteClone, paste)
                      this.outdated = false
                    },
                  },
                ],
              })
            }
            break
          }
          case 'delete': {
            this.$router.push('/')
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
    async getPasteWithPassword() {
      try {
        const { paste: initialPaste } = await getPaste({ id: this.$route.params.id, password: this.password })
        this.paste = initialPaste
        this.pasteClone = initialPaste
        this.passwordRequired = false
        this.connectToWs()
      } catch (err) {
        this.$notify.show({
          message: err.response.data.message,
          type: 'danger',
        })
      }
    },
    async updatePaste() {
      try {
        const paste = {
          title: this.pasteClone.title,
          content: this.pasteClone.content,
          code: this.pasteClone.code,
          visibility: this.pasteClone.visibility,
          expiry: this.pasteClone.expiry,
        }
        this.newPassword.length && (paste.password = this.newPassword)
        await editPaste({ id: this.paste._id, paste })
        this.newPassword = ''
      } catch (err) {
        this.$notify.show({
          message: err.response.data.message,
          type: 'danger',
        })
      } finally {
        this.editing = false
      }
    },
    async forkPaste() {
      try {
        const {
          paste: { _id: pasteId },
        } = await forkPaste(this.paste._id)
        this.$router.push(`/${pasteId}`)
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

<style>
.my-editor {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}
.prism-editor__textarea:focus {
  outline: none;
}
</style>