<template>
  <div class="base-input">
    <label v-if="label.length" :for="label" class="label">
      {{ label }}
    </label>
    <input v-bind="$attrs" :value="value" class="input" @input="onInput" />
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: '',
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
.base-input {
  @apply flex flex-col gap-2;
}
.base-input .label {
  @apply dark:text-gray-300 text-gray-600 text-base font-semibold;
}
.base-input .input {
  @apply w-full h-10 px-3 base-input-default;
}
.base-input-default {
  @apply border rounded;
  @apply placeholder-black dark:placeholder-white placeholder-opacity-20 dark:placeholder-opacity-20;
  @apply border-gray-300 dark:border-gray-600-spotify;
  @apply bg-white dark:bg-gray-700-spotify;
  @apply hover:border-black dark:hover:border-white hover:border-opacity-30 dark:hover:border-opacity-10;
  @apply focus:ring-2 focus:outline-none focus:border-transparent;
}
</style>
