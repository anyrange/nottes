<template>
  <prism-editor
    v-model="model"
    v-bind="$attrs"
    class="editor p-3 border rounded default-border"
    :highlight="highlighter"
  />
</template>

<script>
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import Prism from '@/plugins/prism.js'

export default {
  name: 'CodeEditor',
  components: {
    PrismEditor,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    highlighter(code) {
      const lang = this.language === 'md' ? 'js' : this.language
      return Prism.highlight(code, Prism.languages[lang])
    },
  },
}
</script>

<style>
.editor {
  font-size: 1em;
  font-size: var(--prism-font-size);
  font-family: monospace;
  font-family: var(--prism-font-family);
}
</style>
