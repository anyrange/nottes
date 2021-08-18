import { getUserProfile } from '@/api'

const defaultState = () => {
  return {
    profile: {
      username: '',
      avatar: '',
      email: '',
      hasPassword: false,
      registered: '',
      platform: '',
    },
  }
}

export default {
  state: () => defaultState(),
  mutations: {
    SET_USER(state, user) {
      state.profile = user
    },
    CLEAR_USER(state) {
      Object.assign(state, defaultState())
    },
  },
  actions: {
    async getProfile({ commit }) {
      try {
        commit('SET_USER', await getUserProfile())
      } catch (err) {
        return Promise.reject(err)
      }
    },
  },
}
