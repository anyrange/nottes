<template>
  <main>
    <h1>Error {{ error.statusCode }}</h1>
    <nuxt-link to="/">Go to main page</nuxt-link>
  </main>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
}
</script>
