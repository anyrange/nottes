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
    const { authenticated, tokenExpired } = await this.$axios.$get('/users/me')
    if (tokenExpired) await this.$axios.$get('/auth/refreshToken')
    commit('SET_USER', { authenticated })
  },
  async login({ dispatch }, credentials) {
    try {
      await this.$axios.post('/auth/login', credentials)
      await dispatch('checkAuth')
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async signup({ dispatch }, credentials) {
    try {
      await this.$axios.post('/auth/signup', credentials)
      await dispatch('checkAuth')
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async logout({ dispatch }) {
    try {
      await this.$axios.delete('/auth/logout')
      await dispatch('checkAuth')
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
