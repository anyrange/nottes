<template>
  <main>
    <h1>Authentication</h1>
    <div class="form">
      <div class="form-element">
        <label for="user">Username</label>
        <input type="text" v-model="user" id="user" />
      </div>
      <div class="form-element">
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" />
      </div>
      <button @click="login">Login</button>
      <p v-if="loginError">{{ loginError }}</p>
    </div>
  </main>
</template>

<script>
export default {
  head() {
    let title = "Login";
    let description = "Login page";
    return {
      title: title,
      meta: [
        { hid: "description", name: "description", content: description },
        { hid: "og:title", property: "og:title", content: title },
        { hid: "og:description", property: "og:description", content: description },
      ],
    };
  },
  data() {
    return {
      user: "",
      password: "",
      loginError: "",
    };
  },
  methods: {
    async login() {
      try {
        await this.$axios.post("/api/auth/login", {
          user: this.user,
          password: this.password,
        });
        await this.$store.dispatch("checkAuth");
        this.$router.push("/");
      } catch (err) {
        this.loginError = err.response.data.message;
      }
    },
  },
};
</script>
