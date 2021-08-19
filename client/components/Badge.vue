<template>
  <div
    class="flex gap-1 items-center justify-center py-1 px-2 rounded bg-gray-100 dark:bg-gray-600-spotify text-secondary"
  >
    <span v-if="hasIcon" class="w-5 h-5 text-sm font-semibold">
      <slot name="icon" />
    </span>
    <span class="text-sm font-normal select-none">
      <slot />
    </span>
  </div>
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
