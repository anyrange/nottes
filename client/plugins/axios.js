import { setClient } from '@/services/apiClient'

export default ({ $axios }) => {
  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })
  $axios.onResponse((response) => {
    return response.data
  })
  $axios.onError((error) => {
    return Promise.reject(error)
  })
  setClient($axios)
}
