export default function ({ $axios, redirect, error: nuxtError }) {
  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })
  $axios.onError((error) => {
    return Promise.reject(error)
  })
}
