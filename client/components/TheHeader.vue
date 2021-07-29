<template>
  <header class="flex py-3 lg:py-6 border-b default-border">
    <div class="flex items-center justify-between h-container">
      <nuxt-link class="text-2xl font-normal" to="/">nottes</nuxt-link>
      <nav class="sm:flex gap-2 items-center hidden">
        <template v-if="!authenticated">
          <base-button color="flat" aria-label="Sign up" @click="$router.push('/signup')"> Sign up </base-button>
          <base-button color="primary" aria-label="Login" @click="$router.push('/login')"> Login </base-button>
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
    authenticated() {
      return this.$store.state.authenticated
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
