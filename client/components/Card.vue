<template>
  <div class="flex flex-col items-center w-auto">
    <span class="text-lg font-bold">
      {{ content }}
    </span>
    <div class="lowercase">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: [String, Number],
      required: true,
    },
  },
}
</script>