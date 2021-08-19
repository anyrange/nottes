<template>
  <span class="flex flex-row gap-1 items-center justify-center py-1 px-2 rounded bg-gray-100 dark:bg-gray-600-spotify">
    <i v-if="hasIcon" class="w-5 h-5 text-sm font-semibold primary-text">
      <slot name="icon" />
    </i>
    <span class="text-sm font-normal select-none primary-text">
      <slot />
    </span>
  </span>
</template>

<script>
export default {
  name: 'Badge',
  computed: {
    hasIcon() {
      return !!this.$slots.icon
    },
  },
}
</script>
