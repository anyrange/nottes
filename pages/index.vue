<template>
  <main>
    <h1>nottes</h1>
    <p>Hello World!</p>
  </main>
</template>

<script>
export default {
  head() {
    const title = 'nottes'
    const description = 'nottes-description'

    return {
      title,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
    }
  },
}
</script>
