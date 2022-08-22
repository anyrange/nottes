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
import ogImage from '@/assets/ogImage.png'

export default {
  head() {
    const description =
      'nottes - is a yet another paste tool, a website where you can store text or code snippets online for a set period of time'
    return {
      link: [
        {
          rel: 'canonical',
          href: `${process.env.baseUrl}${this.$route.path}`,
        },
      ],
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.baseUrl}${this.$route.path}`,
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'nottes',
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: process.env.baseUrl + ogImage,
        },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/png',
        },
        {
          hid: 'og:image:width',
          property: 'og:image:width',
          content: '180',
        },
        {
          hid: 'og:image:height',
          property: 'og:image:height',
          content: '180',
        },
      ],
    }
  },
}
</script>
