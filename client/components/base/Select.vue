<template>
  <div class="custom-element-container">
    <label v-if="label.length" :for="$id(label)" class="custom-element-label">{{ label }}</label>
    <div class="base-select">
      <select
        :id="$id(label)"
        v-bind="$attrs"
        class="custom-element w-full pl-3 pr-6 appearance-none"
        :class="[sizeClass]"
        :value="value"
        @change="setValue($event.target.value)"
      >
        <option v-for="option in options" :key="option.value" :disabled="option.disabled" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSelect',
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
    options: {
      type: Array,
      required: true,
    },
  },
  SIZES: ['small', 'regular', 'large'],
  computed: {
    sizeClass() {
      return `base-select-size-${this.$options.SIZES.find((size) => size === this.size)}`
    },
  },
  methods: {
    setValue(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style lang='postcss'>
.base-select {
  @apply relative inline-block w-full;
}
.base-select-size-large {
  @apply h-12 text-base;
}
.base-select-size-regular {
  @apply h-10 text-base;
}
.base-select-size-small {
  @apply h-8 text-sm;
}
</style>