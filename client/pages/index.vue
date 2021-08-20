<template>
  <main class="h-main">
    <h1 class="h-title">New Paste</h1>
    <div class="flex flex-col gap-3">
      <div class="paste-control-head">
        <base-input v-model="paste.title" name="paste-title" autocomplete="off" placeholder="Paste Title" />
        <base-select v-model="paste.code" :options="$options.languageOptions" />
      </div>
      <!-- <base-textarea v-model="paste.content" placeholder="hello world" name="paste" cols="30" rows="15" /> -->
      <!-- <prism-editor v-model="paste.content" :language="paste.code" /> -->
      <client-only>
        <code-editor v-model="paste.content" :language="paste.code" style="height: 330px" />
      </client-only>

      <div class="paste-control-footer">
        <base-select
          v-model="paste.expiry"
          class="md:w-1/3 w-full"
          :options="$options.expirationOptions"
          label="Expiration"
        />
        <base-select
          v-model="paste.visibility"
          class="md:w-1/3 w-full"
          :options="$options.visibilityOptions({ authenticated })"
          label="Visibility"
        />
        <base-input v-model="paste.password" type="password" autocomplete="off" placeholder="Password" />
        <base-button
          aria-label="create new paste"
          color="primary"
          :disabled="!(paste.title && paste.content)"
          @click="submitPaste()"
        >
          Paste
        </base-button>
      </div>
    </div>
  </main>
</template>

<script>
import { createPaste } from '@/api'
import languageOptions from '@/services/options/languageOptions.json'
import expirationOptions from '@/services/options/expirationOptions.json'
import visibilityOptions from '@/services/options/visibilityOptions.js'

export default {
  data() {
    return {
      paste: {
        title: '',
        code: 'md',
        content: '',
        visibility: 'public',
        expiry: '',
        password: '',
      },
      code: 'console.log("Hello World")',
    }
  },
  head() {
    const title = 'nottes'
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
  languageOptions,
  expirationOptions,
  visibilityOptions,
  computed: {
    authenticated() {
      return this.$store.state.authenticated
    },
  },
  methods: {
    async submitPaste() {
      try {
        const {
          paste: { _id: id },
        } = await createPaste(this.paste)
        this.$router.push(`/${id}`)
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
