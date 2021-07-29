import { checkAuth, refreshToken, login, signup, logout } from '@/api'

export default {
  state: () => ({
    authenticated: false,
  }),
  mutations: {
    SET_AUTH(state, value) {
      state.authenticated = value
    },
  },
  actions: {
    async nuxtServerInit({ dispatch }) {
      await dispatch('checkAuth')
    },
    async checkAuth({ commit }) {
      try {
        const { authenticated, tokenExpired } = await checkAuth()
        if (tokenExpired) {
          const { statusCode } = await refreshToken()
          if (statusCode === 200) commit('SET_AUTH', authenticated)
        }
        commit('SET_AUTH', authenticated)
      } catch (err) {
        commit('SET_AUTH', false)
      }
    },
    async login({ dispatch }, credentials) {
      try {
        await login(credentials)
        await dispatch('user/getProfile', {}, { root: true })
        await dispatch('checkAuth')
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async signup({ dispatch }, credentials) {
      try {
        await signup(credentials)
        await dispatch('user/getProfile', {}, { root: true })
        await dispatch('checkAuth')
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async logout({ dispatch, commit }) {
      try {
        await logout()
        await dispatch('checkAuth')
        commit('user/CLEAR_USER', null, { root: true })
      } catch (err) {
        return Promise.reject(err)
      }
    },
  },
}
