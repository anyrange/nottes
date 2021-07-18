<template>
  <header>
    <div>nottes</div>
    <nav>
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/login" v-if="!isAuth">Login</nuxt-link>
      {{ isAuth }}
      <button @click="logout" v-if="isAuth">Logout</button>
    </nav>
  </header>
</template>

<script>
export default {
  computed: {
    isAuth() {
      return this.$store.state.isAuth;
    },
  },
  methods: {
    async logout() {
      try {
        await this.$axios.delete("/api/auth/logout");
        await this.$store.dispatch("checkAuth");
        this.$router.push("/");
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
  },
};
</script>
