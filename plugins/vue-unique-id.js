import Vue from 'vue'

Vue.use((Vue) => {
  let uuid = 0
  Vue.mixin({
    beforeCreate() {
      this.uuid = uuid.toString()
      uuid += 1
    },
  })
  Vue.prototype.$id = function (id) {
    return 'uid-' + this.uuid + '&' + id
  }
})
