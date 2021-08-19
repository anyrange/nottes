<template>
  <div class="custom-element-container">
    <label v-if="label.length" :for="$id(label)" class="custom-element-label">{{ label }}</label>
    <textarea-autosize :id="$id(label)" v-model="model" class="custom-element resize-none w-full p-3" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  name: 'BaseTextarea',
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: '',
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
}
</script>