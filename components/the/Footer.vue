<template>
  <footer class="border-t default-border">
    <div class="h-container h-16 flex gap-3 justify-between items-center">
      <p>
        <span>nottes@{{ currentYear }}</span>
        <a class="underline" href="https://github.com/anyrange/nottes"> github </a>
      </p>
      <theme-toggler />
    </div>
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
