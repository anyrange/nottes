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
      <div class="default-background flex flex-col gap-2" :class="{ 'paste-content-fullscreen': fullscreen }">
        <div class="flex flex-col gap-y-3 md:flex-row justify-between items-start">
          <div class="flex flex-row gap-2 md:order-1 order-3">
            <badge>
              <template #icon>
                <icon-view />
              </template>
              {{ paste.views }}
            </badge>
          </div>
          <div class="flex flex-col md:text-center md:order-2 order-1">
            <span class="text-base font-semibold">{{ paste.title }}</span>
            <span class="text-gray-500 dark:text-gray-500-spotify">
              By
              <nuxt-link
                :class="[paste.author.username === 'Guest' ? 'pointer-events-none' : 'link hover:underline']"
                :to="`/user/${paste.author.username}`"
              >
                {{ paste.author.username }}
              </nuxt-link>
              at
              {{ $defaultDateTime(paste.date) }}
            </span>
          </div>
          <div class="flex flex-row gap-2 md:order-3 order-2">
            <badge>
              <template #icon>
                <icon-code />
              </template>
              {{ paste.code }}
            </badge>
          </div>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row justify-between">
          <div class="flex flex-row gap-2 md:order-2 order-1 ml-auto">
            <i v-if="canEditPaste" title="Edit Paste" @click="editing = !editing">
              <icon-edit class="tool-icon" />
            </i>
            <i v-if="authenticated" title="Fork Paste" @click="forkPaste()">
              <icon-fork class="tool-icon" />
            </i>
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
            <i title="Embed Paste">
              <icon-embed class="tool-icon" />
            </i>
            <i title="Fullscreen" @click="fullscreen = !fullscreen">
              <icon-fullscreen class="tool-icon" />
            </i>
          </div>
          <base-button
            v-if="canEditPaste"
            class="md:order-1 order-2"
            aria-label="edit paste"
            color="primary"
            size="small"
            @click="updatePaste()"
          >
            Update Paste
          </base-button>
        </div>
        <component :is="editing ? 'textarea-autosize' : 'code-highlight'" v-model="paste.content" :lang="paste.code">
          {{ paste.content }}
        </component>
      </div>
    </template>
  </main>
</template>

<script>
import { getPaste, forkPaste, editPaste } from '@/api'

export default {
  async asyncData({ route, params, error }) {
    try {
      const { paste } = await getPaste({ id: params.id })
      return { paste }
    } catch (err) {
      if (err.response.data.statusCode === 403) return { passwordRequired: true }
      error(err.response.data)
    }
  },
  data() {
    return {
      password: '',
      paste: {},
      initialPaste: {},
      passwordRequired: false,
      fullscreen: false,
      editing: false,
    }
  },
  head() {
    const title = this.paste.title || 'nottes'
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
  computed: {
    authenticated() {
      return this.$store.state.authenticated
    },
    user() {
      return this.$store.state.user.profile
    },
    canEditPaste() {
      return this.paste.author.username === this.user.username
    },
  },
  methods: {
    async getPasteWithPassword() {
      try {
        const res = await getPaste({ id: this.$route.params.id, password: this.password })
        this.paste = res.paste
        this.initialPaste = res.paste
        this.passwordRequired = false
      } catch (err) {
        this.$notify.show({
          message: err.response.data.message,
          type: 'danger',
        })
      }
    },
    async updatePaste() {
      try {
        await editPaste({
          id: this.paste._id,
          paste: {
            title: this.paste.title,
            content: this.paste.content,
            code: this.paste.code,
            visibility: this.paste.visibility,
            expiry: this.paste.expiry,
            password: this.paste.password,
          },
        })
        this.$notify.show({
          message: 'Successfully updated',
          type: 'success',
        })
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
        this.$notify.show({
          message: 'Successfully forked',
          type: 'success',
        })
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