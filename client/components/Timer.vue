<template>
  <span>{{ timeFromNow }}</span>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'

export default {
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
      this.timeFromNow = formatDistanceToNowStrict(Date.parse(this.time), {
        addSuffix: true,
      })
    },
  },
}
</script>