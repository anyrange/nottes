import rangeOptions from '@/services/options/rangeOptions.json'

export default {
  data() {
    return {
      range: 10,
      page: 1,
      search: '',
      sort: '-date',
    }
  },
  rangeOptions,
  computed: {
    pageStateOptions() {
      return {
        search: this.search,
        page: this.page,
        sort: this.sort,
        range: this.range,
      }
    },
    arrow() {
      const isDescending = this.sort.charAt(0) === '-'
      return {
        direction: isDescending ? 'icon-arrow-down' : 'icon-arrow-up',
        title: isDescending ? this.sort.substring(1) : this.sort,
      }
    },
  },
  watch: {
    $route: {
      handler({ query: { page, search, sort, range } }) {
        this.page = parseInt(page) || this.page
        this.range = parseInt(range) || this.range
        this.search = search || this.search
        this.sort = sort || this.sort
      },
      immediate: true,
    },
    pageStateOptions(query) {
      this.$router.push({ path: this.$route.path, query })
      this.$fetch()
    },
  },
  methods: {
    toggle(title) {
      this.sort = this.sort === title ? `-${title}` : title
    },
  },
}
