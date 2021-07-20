<template>
  <main>
    <h1 class="h-title">Authentication</h1>
    <form class="flex flex-col gap-3 mt-4" @submit.prevent="submit()">
      <base-input v-model="user.username" label="Username" />
      <base-input v-model="user.password" label="Password" />
      <base-button type="submit" w-full color="primary" label="Login" />
    </form>
    <div class="mt-4">
      <h2>Default data</h2>
      <pre>
user {
  username: string1,
  password: stringst
}
      </pre>
    </div>
    <p v-if="error" class="mt-2 bg-red-200 p-3 rounded-sm">{{ error }}</p>
  </main>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      error: '',
    }
  },
  head() {
    const title = 'Login'
    const description = 'Login page'
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
  methods: {
    async submit() {
      try {
        await this.$store.dispatch('login', this.user)
        this.$router.push('/')
      } catch (error) {
        this.error = error.response.data.message
      }
    },
  },
}
</script>
