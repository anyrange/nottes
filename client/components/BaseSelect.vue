<template>
  <div class="base-select-container">
    <span v-if="label.length" class="label">
      {{ label }}
    </span>
    <div class="base-select">
      <select class="select" :value="value" @change="setValue($event.target.value)">
        <option v-for="option in options" :key="option.value" :disabled="option.disabled" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="icon">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>
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
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    options: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  methods: {
    setValue(val) {
      this.$emit('input', val)
    },
  },
}
</script>

<style lang='postcss'>
.base-select-container {
  @apply flex flex-col gap-2;
}
.base-select-container .label {
  @apply dark:text-gray-400-spotify text-gray-600-spotify text-base font-semibold;
}
.base-select {
  @apply relative inline-block w-full;
}
.base-select .icon {
  @apply absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none;
}
.base-select .select {
  @apply w-full h-10 pl-3 pr-6 appearance-none base-select-default;
}
.base-select-default {
  @apply border rounded;
  @apply placeholder-black dark:placeholder-white placeholder-opacity-20 dark:placeholder-opacity-20;
  @apply border-gray-300 dark:border-gray-600-spotify;
  @apply bg-white dark:bg-gray-700-spotify;
  @apply hover:border-black dark:hover:border-white hover:border-opacity-30 dark:hover:border-opacity-10;
  @apply focus:ring-2 focus:outline-none focus:border-transparent;
}
</style>