<template>
  <main class="h-main">
    <div>
      <h1 class="h-title">Error {{ error.statusCode }}</h1>
      <h2>{{ error.message }}</h2>
    </div>
    <div>
      <nuxt-link class="link" to="/">Go to main page</nuxt-link>
    </div>
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
