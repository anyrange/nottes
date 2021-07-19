export default function ({ $axios, redirect, error: nuxtError }) {
  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 404) {
      redirect('/404')
    }
    console.log(error.response.statusText)
    return Promise.reject(error)
  })
}
