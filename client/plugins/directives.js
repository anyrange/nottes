import Vue from 'vue'

Vue.directive('tooltip', {
  inserted(el, binding) {
    el.classList.add('hint--' + binding.arg || 'bottom')
    el.ariaLabel = binding.value || 'Tooltip text'
  },
})
