import Vue from 'vue'

Vue.directive('tooltip', {
  inserted(el, binding) {
    el.classList.add('hint--' + binding.arg || 'bottom')
    el.ariaLabel = binding.value || 'Tooltip text'
  },
})

Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})
