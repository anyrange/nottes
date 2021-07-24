export default {
  srcDir: 'client/',
  server: {
    port: process.env.PORT,
  },
  env: {
    baseUrl: process.env.BASE_URL,
  },
  head: {
    title: 'nottes',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000000' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@/assets/css/main.css', '@/assets/css/hint.min.css'],
  plugins: ['~/plugins/dates.js', '~/plugins/directives.js', '~/plugins/vue-unique-id.js'],
  components: true,
  telemetry: false,
  loading: {
    color: '#3b82f6',
  },
  router: {
    prefetchLinks: false,
  },
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/color-mode', '@nuxtjs/fontawesome', '@nuxtjs/tailwindcss'],
  modules: ['@nuxtjs/sitemap'],
  fontawesome: {
    component: 'fa',
    icons: {
      solid: true,
      regular: true,
      brands: true,
    },
  },
  tailwindcss: {
    exposeConfig: true,
  },
  colorMode: {
    classSuffix: '', // Required to work with Tailwind CSS
  },
}
