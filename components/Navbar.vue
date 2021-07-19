<template>
  <header class="flex flex-row">
    <div class="text-2xl">nottes</div>
    <nav>
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link v-if="!isAuth" to="/login">Login</nuxt-link>
      <div>
        isAuth =
        {{ isAuth }}
      </div>
      <button v-if="isAuth" @click="logout">Logout</button>
    </nav>
    <select v-model="$colorMode.preference" class="border w-24 h-8 dark:bg-gray-900 dark:border-gray-700">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </header>
</template>

<script>
export default {
  computed: {
    isAuth() {
      return this.$store.state.isAuth
    },
  },
  methods: {
    async logout() {
      try {
        await this.$axios.delete('/api/auth/logout')
        await this.$store.dispatch('checkAuth')
        this.$router.push('/')
      } catch (err) {
        console.log(err.response.data.message)
      }
    },
  },
}
</script>
