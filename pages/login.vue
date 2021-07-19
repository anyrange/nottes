<template>
  <main>
    <h1>Authentication</h1>
    <div class="form">
      <div class="form-element">
        <label for="user">Username</label>
        <input id="user" v-model="user" type="text" />
      </div>
      <div class="form-element">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" />
      </div>
      <button @click="login">Login</button>
      <p v-if="loginError">{{ loginError }}</p>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      user: '',
      password: '',
      loginError: '',
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
    async login() {
      try {
        await this.$axios.post('/api/auth/login', {
          user: this.user,
          password: this.password,
        })
        await this.$store.dispatch('checkAuth')
        this.$router.push('/')
      } catch (err) {
        this.loginError = err.response.data.message
      }
    },
  },
}
</script>
