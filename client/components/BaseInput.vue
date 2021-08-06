<template>
  <div class="base-input-container">
    <label v-if="label.length" :for="$id(label)" class="base-input-label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="$id(label)"
      ref="input"
      :value="value"
      class="custom-element"
      :class="[inputClass, sizeClass]"
      @input="handleInput"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
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
    size: {
      type: String,
      required: false,
      default: 'regular',
    },
    wFull: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  SIZES: ['small', 'regular', 'large'],
  computed: {
    sizeClass() {
      return `base-input-size-${this.$options.SIZES.find((size) => size === this.size)}`
    },
    inputClass() {
      return {
        'base-input-fullwidth': this.wFull,
      }
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
.base-input-container {
  @apply flex flex-col gap-2;
}
.base-input-label {
  @apply dark:text-gray-300 text-gray-600 text-base font-semibold;
}
.base-input-fullwidth {
  @apply w-full;
}
.base-input-size-large {
  @apply h-12 px-4;
}
.base-input-size-regular {
  @apply h-10 px-4;
}
.base-input-size-small {
  @apply h-8 px-2;
}
</style>
