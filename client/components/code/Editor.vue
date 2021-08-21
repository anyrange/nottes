<template>
  <prism-editor v-model="model" v-bind="$attrs" class="custom-element editor p-3" :highlight="highlighter" />
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
      return Prism.highlight(code, Prism.languages[this.language])
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
