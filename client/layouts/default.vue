<template>
  <div class="flex flex-col gap-3 h-screen justify-between transition-colors duration-300 ease-linear">
    <the-header />
    <div class="h-container mb-auto">
      <div class="flex flex-col sm:flex-row sm:mt-8 lg:gap-x-20 gap-x-12 gap-y-3 justify-between">
        <nuxt class="lg:w-4/5 sm:w-2/3 w-full" />
        <the-sidebar class="lg:w-1/5 sm:w-1/3 w-full" />
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