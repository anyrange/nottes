<template>
  <button class="theme-toggler default-border" aria-label="theme toggle" @click="setCurrentTheme">
    <icon-desktop class="iсon theme-toggler-icon" :class="$colorMode.preference === 'system' ? 'show' : 'hide'" />
    <icon-moon class="iсon theme-toggler-icon" :class="$colorMode.preference === 'dark' ? 'show' : 'hide'" />
    <icon-sun class="iсon theme-toggler-icon" :class="$colorMode.preference === 'light' ? 'show' : 'hide'" />
  </button>
</template>

<script>
export default {
  name: 'ThemeToggler',
  methods: {
    setCurrentTheme() {
      this.$colorMode.preference =
        this.$colorMode.preference === 'system' ? 'light' : this.$colorMode.preference === 'light' ? 'dark' : 'system'
    },
  },
}
</script>

<style lang="postcss">
.theme-toggler {
  @apply overflow-hidden outline-none h-10 w-10 flex items-center justify-center border rounded-full;
}
.theme-toggler-icon {
  @apply w-5 h-5 absolute;
}
.show {
  animation: show-icon 300ms forwards;
}
.hide {
  animation: hide-icon 300ms forwards;
}
@keyframes show-icon {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}
@keyframes hide-icon {
  from {
    opacity: 1;
    transform: scaleY(1);
  }
  to {
    opacity: 0;
    transform: scaleY(0);
  }
}
</style>
