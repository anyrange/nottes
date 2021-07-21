<template>
  <main class="h-main">
    <h1 class="h-title">Pasta</h1>
  </main>
</template>

<script>
export default {
  asyncData({ route, params }) {
    // if (process.server) {
    //   console.log(route.params.id)
    //   console.log(params.id)
    // }
    const pasteId = route.params.id
    console.log(pasteId)
  },
}
</script>

<style lang="scss" scoped>
</style>