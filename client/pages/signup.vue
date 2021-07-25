<template>
  <main class="h-main">
    <h1 class="h-title">Sign up</h1>
    <form class="flex flex-col gap-3" @submit.prevent="submit()">
      <base-input v-model="user.username" label="Username" placeholder="Username" />
      <base-input v-model="user.password" label="Password" type="password" placeholder="Password" />
      <base-input v-model="user.email" label="Email" placeholder="Email" />
      <base-button type="submit" w-full color="primary" label="Sign Up" />
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>
    </form>
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
    const title = 'Sign up - nottes'
    const description = 'Sign up page'
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
        await this.$store.dispatch('signup', this.user)
        this.$router.push('/login')
      } catch (error) {
        this.$store.dispatch('notify/addNotification', {
          message: error.response.data.message,
          type: 'danger',
        })
      }
    },
  },
}
</script>