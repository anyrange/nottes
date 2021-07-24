<template>
  <textarea id="paste" v-bind="$attrs" :value="value" class="base-textarea custom-element" @input="handleInput" />
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
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value)
    },
  },
}
</script>

<style lang="postcss">
.base-textarea {
  @apply w-full px-3 py-2 resize-none;
}
</style>
