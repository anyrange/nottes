<template>
  <button
    class="base-button"
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    :class="[buttonClass, sizeClass, colorClass]"
    @click.stop="handleClick($event)"
  >
    <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    color: {
      type: String,
      required: false,
      default: 'flat',
    },
    size: {
      type: String,
      required: false,
      default: 'regular',
    },
    type: {
      type: String,
      required: false,
      default: 'button',
    },
    href: {
      type: String,
      required: false,
      default: '',
    },
    target: {
      type: String,
      required: false,
      default: '_blank',
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    wFull: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['click'],
  COLORS: ['primary', 'negative', 'flat'],
  SIZES: ['small', 'regular', 'large'],
  computed: {
    colorClass() {
      return `base-button-color-${this.$options.COLORS.find((color) => color === this.color)}`
    },
    sizeClass() {
      return `base-button-size-${this.$options.SIZES.find((size) => size === this.size)}`
    },
    buttonClass() {
      return {
        'base-button-fullwidth': this.wFull,
        'base-button-disabled': this.disabled,
      }
    },
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
      if (this.href) window.open(this.href, this.target)
    },
  },
}
</script>

<style lang="postcss">
.base-button {
  @apply flex rounded items-center justify-center text-center select-none font-normal focus:outline-none focus:ring-2;
}
.base-button-disabled {
  @apply opacity-20;
}
.base-button-fullwidth {
  @apply w-full;
}
.base-button-size-large {
  @apply h-12 px-4 text-base;
}
.base-button-size-regular {
  @apply h-10 px-4 text-base;
}
.base-button-size-small {
  @apply h-8 px-2 text-sm;
}
.base-button-color-flat {
  @apply hover:border-black dark:hover:border-white hover:border-opacity-30 dark:hover:border-opacity-10;
  @apply border border-gray-300 dark:border-gray-600-spotify;
  @apply bg-white dark:bg-gray-700-spotify;
}
.base-button-color-primary {
  @apply focus:ring-blue-200 dark:focus:ring-blue-400 text-white bg-blue-500 hover:bg-blue-600;
}
.base-button-color-negative {
  @apply focus:ring-red-200 dark:focus:ring-red-800 text-white bg-red-500 hover:bg-red-600;
}
</style>
