import { setClient } from '@/services/apiClient'

export default ({ $axios }) => {
  $axios.onResponse((response) => {
    return response.data
  })
  $axios.onError((error) => {
    return Promise.reject(error)
  })
  setClient($axios)
}
