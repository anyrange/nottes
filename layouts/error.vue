<template>
  <main>
    <h1>Error {{ error.statusCode }}</h1>
    <nuxt-link to="/">Go to main page</nuxt-link>
  </main>
</template>

<script>
export default {
  props: ["error"],
  layout: "default",
};
</script>
