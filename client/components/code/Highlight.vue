<template>
  <div class="fullwidth border rounded default-border">
    <div class="w-full overflow-x-auto">
      <article v-if="language === 'md'" ref="markdown" class="markdown-body p-3 default-text"></article>
      <pre v-else class="prism"><code ref="code" :class="`language-${language} diff-highlight`"></code></pre>
    </div>
  </div>
</template>
<script>
import marked from 'marked'
import DOMPurify from 'dompurify'
import Prism from '@/plugins/prism.js'

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
          DOMPurify.addHook('uponSanitizeElement', (node, data) => {
            if (data.tagName === 'iframe') {
              const src = node.getAttribute('src') || ''
              if (!src.startsWith('https://www.youtube.com/embed/')) {
                if (!node.parentNode) return
                return node.parentNode.removeChild(node)
              }
            }
          })
          const sanitizedHTML = DOMPurify.sanitize(this.code, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
          })
          markdown.innerHTML = marked.parse(sanitizedHTML)
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