<template>
  <div>
    <navbar />
    <nuxt />
  </div>
</template>

<script>
export default {
  head() {
    return {
      link: [
        { rel: 'canonical', href: `${process.env.baseUrl}${this.$route.path}` },
      ],
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
