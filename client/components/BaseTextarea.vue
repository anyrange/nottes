<template>
  <textarea
    id="paste"
    v-bind="$attrs"
    ref="textarea"
    :value="value"
    rows="1"
    class="base-textarea custom-element"
    @input="handleInput"
  />
</template>

<script>
export default {
  name: 'BaseTextarea',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.resize()
  },
  methods: {
    handleInput(event) {
      this.resize()
      this.$emit('input', event.target.value)
    },
    resize() {
      const { textarea } = this.$refs
      textarea.style.height = textarea.scrollHeight + 'px'
    },
  },
}
</script>

<style lang="postcss">
.base-textarea {
  @apply w-full px-3 py-2 resize-none;
}
</style>
