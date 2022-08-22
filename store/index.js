import { checkAuth, login, signup, logout } from '@/api'

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
    async nuxtServerInit({ dispatch, state }) {
      await dispatch('checkAuth')
    },
    async checkAuth({ commit, dispatch }) {
      const { authenticated } = await checkAuth()
      authenticated
        ? await dispatch('user/getProfile', {}, { root: true })
        : commit('user/CLEAR_USER', null, { root: true })
      commit('SET_AUTH', authenticated)
    },
    async login({ dispatch }, credentials) {
      try {
        await login(credentials)
        await dispatch('checkAuth')
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async signup({ dispatch }, credentials) {
      try {
        await signup(credentials)
        await dispatch('checkAuth')
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async logout({ dispatch, commit }) {
      try {
        await logout()
        await dispatch('checkAuth')
      } catch (err) {
        return Promise.reject(err)
      }
    },
  },
}
