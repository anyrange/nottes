import { nanoid } from 'nanoid'
import Vue from 'vue'

const eventBus = new Vue()

/**
 * @param {('info'|'success'|'warning'|'danger')} type
 */

const notify = {
  show: ({
    id = nanoid(),
    message,
    type = 'info',
    delay = 3000,
    progress = true,
    closable = true,
    unique = false,
    actions = {},
  }) => {
    eventBus.$emit('newNotification', {
      id,
      message,
      type,
      delay,
      progress,
      closable,
      unique,
      actions,
    })
  },
  dismiss: (id) => {
    eventBus.$emit('dismissNotification', id)
  },
  clear: () => {
    eventBus.$emit('clearNotifications')
  },
}

export default ({ app }, inject) => {
  inject('notify', notify)
  inject('eventBus', eventBus)
}
