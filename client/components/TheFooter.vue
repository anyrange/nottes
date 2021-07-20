<template>
  <footer class="border-t border-b border-gray-200 dark:border-gray-700-spotify">
    <div class="h-container h-20 flex items-center">nottes {{ currentYear }}</div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style lang="postcss">
</style>