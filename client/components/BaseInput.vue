<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="label" class="dark:text-gray-300 text-lg font-normal">
      {{ label }}
    </label>
    <input
      v-bind="$attrs"
      :id="label"
      :value="value"
      class="
        w-full
        px-4
        py-2
        border
        rounded-sm
        dark:border-gray-600-spotify
        dark:bg-gray-700-spotify
        placeholder-gray-400
        focus:ring-2 focus:ring-opacity-50
        focus:outline-none
        disabled:opacity-40
      "
      @input="onInput"
    />
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value)
    },
  },
}
</script>
