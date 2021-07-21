import Vue from 'vue'

function initTooltip(el, binding) {
  const position = binding.arg || 'top'
  const tooltipText = binding.value || 'Tooltip text'
  el.setAttribute('position', position)
  el.setAttribute('tooltip', tooltipText)
}

Vue.directive('tooltip', {
  inserted(el, binding) {
    initTooltip(el, binding)
  },
  updated(el, binding) {
    initTooltip(el, binding)
  },
})
