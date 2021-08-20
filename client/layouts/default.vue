<template>
  <div>
    <div class="flex flex-col gap-3 h-screen justify-between transition-colors duration-300 ease-linear">
      <the-header />
      <div class="h-container mb-auto">
        <div class="flex flex-col lg:flex-row lg:mt-8 gap-x-6 gap-y-3 justify-between">
          <nuxt class="xl:w-4/5 lg:w-3/4 w-full" />
          <hr />
          <the-sidebar class="xl:w-1/5 lg:w-1/3 w-full flex-none" />
        </div>
      </div>
      <the-footer />
    </div>
    <notifications />
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