<template>
  <div class="fullwidth">
    <div class="w-full overflow-x-auto">
      <!-- eslint-disable-next-line vue/no-v-html  -->
      <article v-if="language === 'md'" class="markdown-body" v-html="renderedMarkdown" />
      <pre v-else class="prism"><code ref="code" :class="`language-${language} diff-highlight`"></code></pre>
    </div>
  </div>
</template>
<script>
import MarkdownIt from 'markdown-it'
import MarkdownItPrism from 'markdown-it-prism'

import Prism from 'prismjs'
import 'prism-theme-vars/base.css'

import 'prismjs/components/prism-diff.js'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-yaml.js'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-sql'

import 'prismjs/plugins/autolinker/prism-autolinker'
import 'prismjs/plugins/autolinker/prism-autolinker.css'

import 'prismjs/plugins/diff-highlight/prism-diff-highlight'
import 'prismjs/plugins/diff-highlight/prism-diff-highlight.css'

const md = new MarkdownIt()
md.use(MarkdownItPrism, { defaultLanguage: 'clike' })

export default {
  name: 'CodeHighlight',
  props: {
    code: {
      type: String,
      required: true,
    },
    diff: {
      type: Boolean,
      required: false,
      default: false,
    },
    language: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      renderedMarkdown: '',
      diffCode: {},
    }
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
          this.renderedMarkdown = md.render(this.code)
        } else {
          const code = this.$refs.code
          code.textContent = this.code
          Prism.highlightElement(this.$refs.code)
        }
      })
    },
  },
}
</script>

<style lang="css">
html:not(.dark) {
  --prism-foreground: #393a34;
  --prism-background: #f8f8f8;

  --prism-font-size: 1rem;

  --prism-block-padding-x: 0.5rem;
  --prism-block-padding-y: 0.5rem;
  --prism-block-margin-x: 0rem;
  --prism-block-margin-y: 0rem;

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

  --prism-font-size: 1rem;

  --prism-block-padding-x: 0.5rem;
  --prism-block-padding-y: 0.5rem;
  --prism-block-margin-x: 0rem;
  --prism-block-margin-y: 0rem;

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