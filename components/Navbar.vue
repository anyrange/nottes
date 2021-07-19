<template>
  <header class="flex h-20 bg-white border-b border-gray-200 dark:bg-gray-900-spotify dark:border-gray-700-spotify">
    <div class="flex items-center justify-between container">
      <nuxt-link class="text-2xl font-normal" to="/">nottes</nuxt-link>
      <div>user: {{ user }}</div>
      <div class="flex gap-4 items-center">
        <nav>
          <nuxt-link v-if="!user.isLoggedIn" to="/login">Login</nuxt-link>
          <button v-if="user.isLoggedIn" @click="logout">Logout</button>
        </nav>
        <select v-model="$colorMode.preference" class="border w-24 h-8 dark:bg-gray-900 dark:border-gray-700">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>
