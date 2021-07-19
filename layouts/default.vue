<template>
  <div class="mb-4 dark:bg-gray-900">
    <navbar />
    <nuxt />
  </div>
</template>

<script>
export default {
  head() {
    return {
      link: [{ rel: 'canonical', href: `${process.env.baseUrl}${this.$route.path}` }],
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.baseUrl}${this.$route.path}`,
        },
      ],
    }
  },
}
</script>
