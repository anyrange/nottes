<template>
  <div class="prism">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <article v-if="lang === 'md'" class="markdown-body" v-html="renderedMarkdown" />
    <pre v-else><code :class="`language-${lang}`">{{value}}</code></pre>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownItPrism from 'markdown-it-prism'
import Prism from '~/plugins/prism'

const md = new MarkdownIt()
md.use(MarkdownItPrism)

export default {
  name: 'CodeHighlight',
  props: {
    value: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      renderedMarkdown: '',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.lang === 'md' ? (this.renderedMarkdown = md.render(this.value)) : Prism.highlightAll()
    })
  },
}
</script>

<style lang="css">
html:not(.dark) {
  --prism-foreground: #393a34;
  --prism-background: #f8f8f8;

  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #bc8671;
  --prism-punctuation: #80817d;
  --prism-literal: #36acaa;
  --prism-keyword: #248459;
  --prism-function: #849145;
  --prism-deleted: #9a050f;
  --prism-class: #2b91af;
  --prism-builtin: #800000;
  --prism-property: #ce9178;
  --prism-regex: #ad502b;
}

html.dark {
  --prism-foreground: #d4d4d4;
  --prism-background: #1e1e1e;

  --prism-namespace: #aaaaaa;
  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #ce9178;
  --prism-punctuation: #d4d4d4;
  --prism-literal: #36acaa;
  --prism-keyword: #38a776;
  --prism-function: #dcdcaa;
  --prism-deleted: #9a050f;
  --prism-class: #4ec9b0;
  --prism-builtin: #d16969;
  --prism-property: #ce9178;
  --prism-regex: #ad502b;
}
code[class*='language-'],
pre[class*='language-'] {
  white-space: pre-wrap !important;
}
</style>