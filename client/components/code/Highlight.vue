<template>
  <div class="fullwidth border rounded default-border">
    <div class="w-full overflow-x-auto">
      <article v-if="language === 'md'" ref="markdown" class="markdown-body p-3 default-text"></article>
      <pre v-else class="prism"><code ref="code" :class="`language-${language} diff-highlight`"></code></pre>
    </div>
  </div>
</template>
<script>
import MarkdownIt from 'markdown-it'
import MarkdownItPrism from 'markdown-it-prism'
import Prism from '@/plugins/prism.js'
const md = new MarkdownIt()
md.use(MarkdownItPrism, { defaultLanguage: 'clike' })

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
          markdown.innerHTML = md.render(this.code)
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