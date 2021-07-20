export const state = () => ({
  user: {
    isLoggedIn: false,
  },
})

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('checkAuth')
  },
  async checkAuth({ commit }) {
    try {
      const { authenticated } = await this.$axios.$get('/users/me')
      commit('SET_USER', { isLoggedIn: authenticated })
    } catch (err) {
      commit('SET_USER', { isLoggedIn: false })
    }
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

export const mutations = {
  SET_USER(state, response) {
    state.user = response
  },
  REMOVE_USER: (state) => {
    state.user.isLoggedIn = false
  },
}
