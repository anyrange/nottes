export default {
  server: {
    port: process.env.PORT,
  },
  env: {
    baseUrl: process.env.BASE_URL,
  },
  head: {
    title: 'nottes',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: "theme-color", content: "#000000" },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    "@/assets/css/main.css"
  ],
  plugins: [
  ],
  components: true,
  telemetry: false,
  loading: false,
  loadingIndicator: false,
  router: {
    prefetchLinks: false
  },
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
  ],
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL: process.env.BASE_URL
  },
  build: {
    extractCSS: true,
    babel: {
      plugins: [
        [
          "@babel/plugin-proposal-private-methods",
          {
            loose: true
          }
        ]
      ],
    },
  },
  render: {
    asyncScripts: true,
    csp: false,
  },
}
