const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId()

export const state = () => ({
  notifications: [],
})

export const mutations = {
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification)
  },
  REMOVE_NOTIFICATION(state, notification) {
    state.notifications = state.notifications.filter((item) => item.id !== notification.id)
  },
  RESET_NOTIFICATIONS(state) {
    state.notifications = []
  },
}

export const getters = {
  getNotifications(state) {
    return state.notifications
  },
}

export const actions = {
  addNotification(
    { commit, dispatch },
    { message, type = 'info', delay = 3000, progress = true, closable = true, actions }
  ) {
    const notification = { id: uid(), message, type, delay, progress, closable, actions }
    commit('ADD_NOTIFICATION', notification)
    if (notification.progress && notification.delay > 0) {
      setTimeout(() => {
        dispatch('removeNotification', notification)
      }, notification.delay)
    }
  },
  removeNotification({ commit }, notification) {
    commit('REMOVE_NOTIFICATION', notification)
  },
  resetNotifications({ commit }) {
    commit('RESET_NOTIFICATIONS')
  },
}
