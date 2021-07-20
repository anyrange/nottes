<template>
  <textarea id="paste" v-bind="$attrs" :value="value" class="base-textarea" />
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
    onInput(event) {
      this.$emit('input', event.target.value)
    },
  },
}
</script>

<style lang="postcss">
.base-textarea {
  @apply w-full px-3 py-2 resize-none	base-textarea-default;
}
.base-textarea-default {
  @apply border rounded;
  @apply placeholder-black dark:placeholder-white placeholder-opacity-20 dark:placeholder-opacity-20;
  @apply border-gray-300 dark:border-gray-600-spotify;
  @apply bg-white dark:bg-gray-700-spotify;
  @apply hover:border-black dark:hover:border-white hover:border-opacity-30 dark:hover:border-opacity-10;
  @apply focus:ring-2 focus:outline-none focus:border-transparent;
}
</style>
