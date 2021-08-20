<template>
  <main class="h-main h-page">
    <h1 class="h-title">Pastes Archive</h1>
  </main>
</template>

<script>
export default {
  head() {
    const title = 'Pastes Archive'
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
      ],
    }
  },
}
</script>