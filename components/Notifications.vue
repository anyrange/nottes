<template>
  <transition-group
    tag="div"
    class="notifications-bottom-left"
    enter-to-class="opacity-100 scale-100"
    enter-active-class="transition ease-out duration-150 transform opacity-0 scale-75"
    leave-active-class="transition ease-in duration-150 transform opacity-0 scale-75"
  >
    <notification
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @close-notification="removeNotification(notification.id)"
    />
  </transition-group>
</template>

<script>
import Notification from '@/components/Notification'

export default {
  name: 'Notifications',
  components: {
    Notification,
  },
  data() {
    return {
      notifications: [],
    }
  },
  created() {
    this.$eventBus.$on('newNotification', (notification) => {
      this.addNotification(notification)
    })
    this.$eventBus.$on('dismissNotification', (id) => {
      this.removeNotification(id)
    })
    this.$eventBus.$on('clearNotifications', () => {
      this.notifications = []
    })
  },
  methods: {
    addNotification(notification) {
      if (notification.unique) {
        this.notifications = []
      }
      this.notifications = [...this.notifications, notification]
      if (notification.progress && notification.delay > 0) {
        setTimeout(() => {
          this.removeNotification(notification.id)
        }, notification.delay)
      }
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter((item) => item.id !== id)
    },
  },
}
</script>

<style lang="postcss">
.notifications-bottom-left {
  @apply fixed bottom-4 left-4 z-50 overflow-x-hidden;
}
</style>
