<template>
  <div class="flex flex-col h-screen justify-between">
    <the-header />
    <div class="h-container mb-auto">
      <div class="flex flex-col sm:flex-row mt-4 gap-4 justify-between">
        <div class="sm:w-3/4 w-full">
          <nuxt />
        </div>
        <div class="w-auto">
          <the-sidebar />
        </div>
      </div>
    </div>
    <the-footer />
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