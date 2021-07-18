module.exports = {
  server: {
    port: process.env.PORT,
  },
  env: {
    baseUrl: process.env.BASE_URL,
  },
  head: {
    htmlAttrs: { lang: "en" },
    meta: [
      { charset: 'utf-8' },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#000000" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" }],
  },
  components: true,
  telemetry: false,
  loading: false,
  loadingIndicator: false,
  router: { prefetchLinks: false },
  modules: ["@nuxtjs/axios"],
  css: ["@/assets/css/main.css"],
  axios: { baseURL: process.env.BASE_URL },
  build: {
    extractCSS: true,
    babel: {
      plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]],
    },
  },
  render: {
    asyncScripts: true,
    csp: false,
  },
};
