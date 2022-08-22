<template>
  <div class="fullwidth border rounded default-border">
    <div class="w-full overflow-x-auto">
      <article v-if="language === 'md'" ref="markdown" class="markdown-body p-3 default-text"></article>
      <pre v-else class="prism"><code ref="code" :class="`language-${language} diff-highlight`"></code></pre>
    </div>
  </div>
</template>
<script>
import { parse } from 'marked'
import DOMPurify from 'dompurify'
import Prism from './prism.js'

export default {
  name: 'CodeHighlight',
  props: {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  watch: {
    language() {
      this.update()
    },
    code() {
      this.update()
    },
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      this.$nextTick(() => {
        if (this.language === 'md') {
          const { markdown } = this.$refs
          const cleanHTML = DOMPurify.sanitize(this.code)
          markdown.innerHTML = parse(cleanHTML)
        } else {
          const { code } = this.$refs
          code.textContent = this.code
        }
        Prism.highlightAll()
      })
    },
  },
}
</script>
