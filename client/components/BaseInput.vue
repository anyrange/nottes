<template>
  <div class="base-input">
    <label v-if="label.length" :for="$id(label)" class="label">{{ label }}</label>
    <input v-bind="$attrs" :id="$id(label)" :value="value" class="input custom-element" @input="onInput" />
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
  @apply w-full h-10 px-3;
}
</style>
