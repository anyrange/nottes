<template>
  <div class="custom-element-container">
    <label v-if="label.length" :for="$id(label)" class="custom-element-label">{{ label }}</label>
    <input
      :id="$id(label)"
      v-bind="$attrs"
      class="custom-element"
      :class="[sizeClass]"
      :value="value"
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
  },
  SIZES: ['small', 'regular', 'large'],
  computed: {
    sizeClass() {
      return `base-input-size-${this.$options.SIZES.find((size) => size === this.size)}`
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
html:not(.dark) {
  --autofill-text-color: #000000;
}
html.dark {
  --autofill-text-color: #ffffff;
}
.base-input-size-large {
  @apply h-12 px-4 text-base;
}
.base-input-size-regular {
  @apply h-10 px-4 text-base;
}
.base-input-size-small {
  @apply h-8 px-2 text-sm;
}
input:-webkit-autofill {
  -webkit-background-clip: text;
  -webkit-text-fill-color: var(--autofill-text-color);
}
</style>
