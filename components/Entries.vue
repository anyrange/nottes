<template>
  <span>Showing {{ fromEntries }} to {{ toEntries }} of {{ entries }} entries</span>
</template>

<script>
export default {
  name: 'Entries',
  props: {
    entries: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    range: {
      type: Number,
      required: true,
    },
  },
  computed: {
    fromEntries() {
      return this.entries ? (this.page - 1) * parseInt(this.range) + 1 : 0
    },
    toEntries() {
      const range = parseInt(this.range)
      const maxEntries = (this.page - 1) * range + range
      return maxEntries < this.entries ? maxEntries : this.entries
    },
  },
}
</script>
