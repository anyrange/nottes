<template>
  <main class="h-main">
    <h1 class="h-title">Login</h1>
    <form class="flex flex-col gap-3" @submit.prevent="submit()">
      <base-input v-model="user.username" label="Username" placeholder="Username" />
      <base-input v-model="user.password" label="Password" type="password" placeholder="Password" />
      <base-button type="submit" w-full color="primary" label="Log In" />
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>
    </form>
    <hr />
    <base-button
      w-full
      color="primary"
      :href="'http://localhost:3000/api/oauth/google'"
      target="_self"
      label="Sign In with Google"
    />
  </main>
</template>

<script>
export default {
  middleware: ['auth-forbidden'],
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
    const title = 'Login - nottes'
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
