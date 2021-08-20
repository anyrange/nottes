<template>
  <main class="h-main h-page">
    <h1 class="h-title">Sign up</h1>
    <form class="flex flex-col gap-3" @submit.prevent="submit()">
      <base-input v-model="user.username" label="Username" autocomplete="off" placeholder="Username" />
      <base-input v-model="user.password" label="Password" autocomplete="off" type="password" placeholder="Password" />
      <base-input v-model="user.email" label="Email" autocomplete="off" placeholder="Email" />
      <base-button type="submit" w-full color="primary">Sign Up</base-button>
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>
    </form>
    <hr />
    <base-button w-full color="primary" :href="googleOAuthRedirectURL" target="_self">
      Sign Up with Google
    </base-button>
  </main>
</template>


<script>
export default {
  middleware: ['auth-forbidden'],
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      error: '',
    }
  },
  head() {
    const title = 'Sign up'
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
      ],
    }
  },
  computed: {
    googleOAuthRedirectURL() {
      return process.env.baseUrl + '/api/oauth/google'
    },
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch('signup', this.user)
        this.$router.push('/login')
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