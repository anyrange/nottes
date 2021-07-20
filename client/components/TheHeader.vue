<template>
  <header class="flex h-20 border-b border-gray-200 dark:border-gray-700-spotify">
    <div class="flex items-center justify-between h-container">
      <nuxt-link class="text-2xl font-normal" to="/">nottes</nuxt-link>
      <nav class="flex gap-2 items-center">
        <base-select
          v-model="$colorMode.preference"
          :options="[
            { label: 'System', value: 'system' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]"
        />
        <template v-if="!user.isLoggedIn">
          <base-button color="primary" @click="$router.push('/login')"> Login </base-button>
          <base-button color="flat" @click="$router.push('/signup')"> Sing up </base-button>
        </template>
        <template v-else>
          <base-button color="flat" @click="logout"> Logout </base-button>
        </template>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      modalOpened: false,
    }
  },
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
    openModal() {
      this.modalOpened = true
    },
    closeModal() {
      this.modalOpened = false
    },
  },
}
</script>
