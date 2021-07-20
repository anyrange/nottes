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
  css: ['@/assets/css/main.css'],
  plugins: ['~/plugins/axios'],
  components: true,
  telemetry: false,
  router: {
    prefetchLinks: false,
  },
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/color-mode', '@nuxtjs/tailwindcss'],
  modules: ['@nuxtjs/axios', '@nuxtjs/sitemap'],
  axios: {
    baseURL: `${process.env.BASE_URL}/api`,
  },
  tailwindcss: {
    exposeConfig: true,
  },
  colorMode: {
    classSuffix: '',
  },
  build: {
    extractCSS: true,
    babel: {
      plugins: [
        [
          '@babel/plugin-proposal-private-methods',
          {
            loose: true,
          },
        ],
      ],
    },
  },
  render: {
    asyncScripts: true,
    csp: false,
  },
  workbox: {
    cacheAssets: false, // for /*
    offline: false, // for /_nuxt/*
  },
}
