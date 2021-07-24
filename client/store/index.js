import { checkAuth, refreshToken, login, signup, logout } from '@/api'

export const state = () => ({
  user: {
    authenticated: false,
  },
})

export const mutations = {
  SET_USER(state, response) {
    state.user = response
  },
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('checkAuth')
  },
  async checkAuth({ commit }) {
    try {
      const { authenticated, tokenExpired } = await checkAuth()
      if (tokenExpired) await refreshToken()
      commit('SET_USER', { authenticated })
    } catch (error) {
      commit('SET_USER', { authenticated: false })
    }
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
  async logout({ dispatch }) {
    try {
      await logout()
      await dispatch('checkAuth')
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
