<template>
  <div class="pagination">
    <button
      class="pagination-item"
      type="button"
      :disabled="isInFirstPage"
      aria-label="Go to first page"
      @click="onClickFirstPage"
    >
      <icon-double-arrow-left class="icon w-5 h-5" />
    </button>
    <button
      class="pagination-item"
      type="button"
      :disabled="isInFirstPage"
      aria-label="Go to previous page"
      @click="onClickPreviousPage"
    >
      <icon-arrow-left class="icon w-5 h-5" />
    </button>
    <button
      v-for="(page, index) in pages"
      :key="index"
      class="pagination-item"
      type="button"
      :disabled="page.isDisabled"
      :class="{ active: isPageActive(page.name) }"
      :aria-label="`Go to page number ${page.name}`"
      @click="onClickPage(page.name)"
    >
      {{ page.name }}
    </button>
    <button
      class="pagination-item"
      type="button"
      :disabled="isInLastPage"
      aria-label="Go to next page"
      @click="onClickNextPage"
    >
      <icon-arrow-right class="icon w-5 h-5" />
    </button>
    <button
      class="pagination-item"
      type="button"
      :disabled="isInLastPage"
      aria-label="Go to last page"
      @click="onClickLastPage"
    >
      <icon-double-arrow-right class="icon w-5 h-5" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  computed: {
    startPage() {
      if (this.currentPage === 1) {
        return 1
      }
      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons + 1
      }
      return this.currentPage - 1
    },
    endPage() {
      return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages)
    },
    pages() {
      const range = []
      for (let i = this.startPage; i <= this.endPage; i += 1) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage,
        })
      }
      return range
    },
    isInFirstPage() {
      return this.currentPage === 1
    },
    isInLastPage() {
      return this.currentPage === this.totalPages
    },
  },
  methods: {
    onClickFirstPage() {
      this.$emit('pagechanged', 1)
    },
    onClickPreviousPage() {
      this.$emit('pagechanged', this.currentPage - 1)
    },
    onClickPage(page) {
      this.$emit('pagechanged', page)
    },
    onClickNextPage() {
      this.$emit('pagechanged', this.currentPage + 1)
    },
    onClickLastPage() {
      this.$emit('pagechanged', this.totalPages)
    },
    isPageActive(page) {
      return this.currentPage === page
    },
  },
  template: '#pagination',
}
</script>


<style>
.pagination {
  @apply flex items-center;
}

.pagination-item {
  @apply h-8 w-10 rounded flex items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-gray-600-spotify;
}

.active {
  @apply bg-gray-200 dark:bg-gray-700-spotify;
}
</style>