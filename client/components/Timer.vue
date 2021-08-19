<template>
  <span>{{ timeFromNow }}</span>
</template>

<script>
export default {
  name: 'Timer',
  props: {
    time: {
      type: [Date, String],
      required: true,
    },
  },
  data() {
    return {
      timeFromNow: null,
    }
  },
  created() {
    this.getTimeFromNow()
    setInterval(this.getTimeFromNow, 1000)
  },
  destroyed() {
    clearInterval(this.getTimeFromNow)
  },
  methods: {
    getTimeFromNow() {
      this.timeFromNow = this.$formatDistanceToNow(this.time)
    },
  },
}
</script>