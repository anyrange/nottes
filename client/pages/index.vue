<template>
  <main class="h-main">
    <h1 class="h-title">New Paste</h1>
    <div class="flex flex-col gap-3">
      <div class="flex flex-row gap-3">
        <base-input v-model="paste.title" name="paste-title" autocomplete="off" placeholder="Paste Title" />
        <base-select
          v-model="paste.code"
          :options="[
            { label: 'Markdown', value: 'markup' },
            { label: 'Java', value: 'java' },
            { label: 'C++', value: 'cpp' },
            { label: 'JavaScript', value: 'js' },
          ]"
        />
      </div>
      <base-textarea v-model="paste.content" placeholder="hello world" name="paste" cols="30" rows="15" />
      <div class="flex md:flex-row flex-col gap-3 md:items-end 2xl:w-4/6 xl:w-3/4 lg:w-1/2 w-full">
        <base-select
          v-model="paste.expiration"
          class="md:w-1/3 w-full"
          :options="[
            { label: 'Never', value: 'never' },
            { label: '10 Minutes', value: '10m' },
            { label: '1 Hour', value: '1h' },
            { label: '1 Day', value: '1d' },
            { label: '1 Week', value: '1w' },
            { label: '2 Weeks', value: '2w' },
            { label: '1 Month', value: '1month' },
          ]"
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

export default {
  data() {
    return {
      paste: {
        title: '',
        code: 'cpp',
        content: '',
        visibility: 'public',
        expiration: 'never',
        password: '',
      },
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
  computed: {
    authenticated() {
      return this.$store.state.authenticated
    },
  },
  methods: {
    async submitPaste() {
      try {
        await createPaste(this.paste)
        Object.assign(this.$data, this.$options.data())
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
