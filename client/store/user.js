import { getUserProfile } from '@/api'

const defaultState = () => {
  return {
    profile: {
      username: '',
      avatar: '',
      email: '',
      hasPassword: false,
      registered: '',
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
        const user = await getUserProfile()
        commit('SET_USER', user)
      } catch (err) {
        return Promise.reject(err)
      }
    },
  },
}
