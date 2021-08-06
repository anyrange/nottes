import Vue from 'vue'

Vue.use((Vue) => {
  Vue.mixin({
    mounted() {
      this.disableAutoComplete()
    },
    methods: {
      disableAutoComplete() {
        const elements = document.querySelectorAll('[autocomplete="off"]')
        if (!elements) {
          return
        }
        elements.forEach((element) => {
          element.setAttribute('readonly', 'readonly')
          element.style.backgroundColor = 'inherit'
          setTimeout(() => {
            element.removeAttribute('readonly')
          }, 500)
        })
      },
    },
  })
})
