<template>
  <main class="h-main">
    <h1 class="h-title">New Paste</h1>
    <div class="flex gap-3 items-center">
      <base-input id="paste-title" v-model="paste.title" placeholder="Paste Title" />
      <base-select
        v-model="paste.code"
        :options="[
          { label: 'Java', value: 'java' },
          { label: 'C++', value: 'cpp' },
        ]"
      />
      <base-button color="primary" label="Paste" />
    </div>
    <base-textarea v-model="paste.content" placeholder="hello world" name="paste" cols="30" rows="15" />
    <div class="flex flex-col gap-3">
      <div class="flex gap-3">
        <base-select
          v-model="paste.expiration"
          :options="[
            { label: 'Never', value: 'never' },
            { label: '10 Minutes', value: '10m' },
          ]"
          label="Paste Expiration"
        />
        <base-select
          v-model="paste.visibility"
          :options="[
            { label: 'Public', value: 'public' },
            { label: 'Unlisted', value: 'unlisted' },
            { label: 'Private', value: 'private', disabled: true },
          ]"
          label="Paste Visibility"
        />
      </div>
      <base-input id="paste-password" v-model="paste.password" placeholder="Password (Optional)" />
    </div>
  </main>
</template>

<script>
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
}
</script>
