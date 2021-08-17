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
        <p>
          <span class="text-base font-semibold">
            {{ paste.title }}
          </span>
          <span class="text-gray-500 dark:text-gray-500-spotify">by</span>
          <nuxt-link
            :class="[paste.author.username === 'Guest' ? 'pointer-events-none' : 'link hover:underline']"
            :to="`/user/${paste.author.username}`"
          >
            {{ paste.author.username }}
          </nuxt-link>
          <span class="text-gray-500 dark:text-gray-500-spotify">at {{ $defaultDateTime(paste.date) }}</span>
        </p>
        <div class="flex flex-col sm:flex-row gap-2 justify-between">
          <div class="flex flex-row gap-2">
            <badge>
              <template #icon>
                <icon-view />
              </template>
              {{ paste.views }}
            </badge>
            <badge>
              <template #icon>
                <icon-code />
              </template>
              {{ paste.code }}
            </badge>
          </div>
          <div class="flex flex-row gap-2">
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
        </div>
        <div v-if="editing" class="paste-control-head">
          <base-input v-model="paste.title" name="paste-title" autocomplete="off" placeholder="Paste Title" />
          <base-select v-model="paste.code" :options="$options.languages" />
        </div>
        <component :is="editing ? 'textarea-autosize' : 'code-highlight'" v-model="paste.content" :lang="paste.code" />
        <div v-if="editing" class="paste-control-footer">
          <base-select
            v-model="paste.expiry"
            class="md:w-1/3 w-full"
            :options="$options.expirationOptions"
            label="Paste Expiration"
          />
          <base-select
            v-model="paste.visibility"
            class="md:w-1/3 w-full"
            :options="[
              { label: 'Public', value: 'public' },
              { label: 'Unlisted', value: 'unlisted' },
              { label: 'Private', value: 'private', disabled: !authenticated },
            ]"
            label="Paste Visibility"
          />
          <base-input v-model="newPassword" type="password" autocomplete="off" placeholder="Password" />
          <base-button color="primary" class="md:order-1 order-2" aria-label="edit paste" @click="updatePaste()">
            Update
          </base-button>
        </div>
      </div>
    </template>
  </main>
</template>

<script>
import { getPaste, forkPaste, editPaste } from '@/api'
import languages from '@/languages.json'
import expirationOptions from '@/expirationOptions.json'

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
      newPassword: '',
      paste: {},
      passwordRequired: false,
      fullscreen: false,
      editing: false,
    }
  },
  languages,
  expirationOptions,
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
        const { paste } = await getPaste({ id: this.$route.params.id, password: this.password })
        this.paste = paste
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
            password: this.newPassword,
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