<template lang="pug">

.dynamic-table
  // Фильтры и поиск
  .filters
    input.dynamic-table-search(
      v-model="searchQuery"
      placeholder="Поиск"
    )

    .dynamic-table-filter(
      v-for="filter, index in filterableColumns"
      :key="filter.key"
    )
      label {{ filter.title }}: 
      select(
        v-model="filters[index].value"
        name="filter.title"
        required
        @input="applyFilter"
      )
        option(:value="null" selected) {{ !filters[index].value ? 'Выберите' : '' }} 
        option(v-for="filterOption in filterOptionsList(filter.key)") {{ filterOption }}

    .filter-reset(@click="resetFilters") Сбросить фильтры

  // Таблица
  table
    thead.dynamic-table-head
      tr
        th(v-for="column in columns")
          .cell-flex
            span {{ column.title }}

            .sorter(
              v-if="sortableColumns.find((c) => c.key === column.key)"
              @click="toggleSort(column.key)"
            ) 
              span(v-if="sorter === column.key") {{ sorterDirection === 'up' ? '↑' : sorterDirection === 'down' ? '↓' : '↕️' }}
              span(v-else) ↕️

    tbody.dynamic-table-body
      tr(v-for="row in pageContent")
        td(v-for="column in columns")
          | {{ row[column.key] || '-' }}

      // Если ничего не нашли/не нафильтровали
      tr
        td(
          v-if="!filteredItems.length"
          :colspan="columns.length"
        ) Ничего не найдено

  // Странички
  .dynamic-table-pagination
    .page-text Страничка: 
    .page(
      v-for="page in pagesCount"
      :class="{ active: pageCurrent === page}"
      @click="pageCurrent = page"
    ) {{ page }}

</template>

<script>
export default {
  name: 'dynamic-table',

  // Компонент принимает список объектов @items
  // И отображает только те столбцы, которые заведены через @columns
  // Количество элементов на страницу выставляется через @itemsPerPage

  props: {
    items: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      searchQuery: null,
      filters: [],
      sorter: null,
      sorterDirection: null,
      pageCurrent: 1
    }
  },

  created() {
    this.resetFilters()
  },

  computed: {
    filteredItems() {
      let results = Array.from(this.items)
      const activeFilters = this.filters.filter((f) => f.value)

      if (this.searchQuery) {
        results = this.items.filter((item) => Object.values(item).some((v) => v.toString().toLowerCase().includes(this.searchQuery.toLowerCase())))
      }
      
      if (activeFilters.length) {
        activeFilters.forEach((filter) => {
          results = results.filter((r) => r[filter.key].toString() === filter.value.toString())
        })
      }

      if (this.sorter) {
        results = results.sort(this.sorterAlgo)
      }

      return results
    },

    pageContent() {
      const startAt = (this.pageCurrent - 1) * this.itemsPerPage
      const endAt = (this.pageCurrent) * this.itemsPerPage

      return this.filteredItems.slice(startAt, endAt)
    },

    filterableColumns() {
      return this.columns.filter((c) => c.filterable)
    },

    sortableColumns() {
      return this.columns.filter((c) => c.sortable)
    },

    pagesCount() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    }
  },

  methods: {
    filterOptionsList(key) {
      return new Set([...this.items.map((i) => i[key])])
    },

    applyFilter() {
      this.pageCurrent = 1
    },

    toggleSort(key) {
      if (this.sorter !== key) {
        this.sorter = key
        this.sorterDirection = 'up'
        return
      }

      if (this.sorter === key && this.sorterDirection === 'up') {
        this.sorterDirection = 'down'
        return
      }

      if (this.sorter === key && this.sorterDirection === 'down') {
        this.sorterDirection = null
        this.sorter = null
        return
      }

      this.pageCurrent = 1
    },

    sorterAlgo(a, b) {
      if (typeof this.items[0][this.sorter] === 'number') {
        if (this.sorterDirection === 'up') return a[this.sorter] - b[this.sorter]
        if (this.sorterDirection === 'down') return b[this.sorter] - a[this.sorter]
      }

      // ToDo: сортировка по алфавиту
    },

    resetFilters() {
      this.pageCurrent = 1
      this.searchQuery = null
      this.filters = []

      this.filterableColumns.forEach((filter) => {
        this.filters.push({ key: filter.key, value: null })
      })
    }
  }
}
</script>

<style lang="sass" scoped>
$bg-color: #eee

.dynamic-table
  display: inline-block
  margin: 12px auto
  border: 10px solid $bg-color

  table
    width: 100%
    border-radius: 5px
    text-align: left

  th, td
    padding: 6px 12px

  tbody
    tr:nth-child(2n + 1)
      background-color: #f1f1f1

// Сортировка
.cell-flex
  display: flex

.sorter
  margin-left: auto
  cursor: pointer

// Поиск и фильтры
.filters
  display: flex
  padding-bottom: 10px
  background-color: $bg-color
  text-align: left

.dynamic-table-search
  height: 18px
  margin-right: 20px
  padding: 6px 8px
  line-height: 18px
  border: 1px solid #bbb

  &:focus
    outline: none
    border: 1px solid #ccd9eb

.dynamic-table-filter
  display: inline-flex
  height: 32px
  margin-right: 20px

  label
    height: 100%
    padding-right: 6px
    line-height: 32px

  select
    min-width: 100px
    border: 1px solid #bbb

    &:focus
      outline: none

  option[disabled]
    display: none

// Сброс фильтров
.filter-reset
  width: 70px
  height: 29px
  margin-left: auto
  padding: 3px 0 0 0
  text-align: right
  font-size: 80%
  line-height: 14px
  text-decoration: underline
  cursor: pointer

  &:hover
    color: #7cafd9

// Постраничность (пагинация)
.dynamic-table-pagination
  display: flex
  align-items: flex-start
  justify-content: flex-start
  flex-wrap: wrap
  background-color: $bg-color
  padding-top: 10px

  .page-text
    height: 24px
    margin-right: 4px
    font-size: 90%
    line-height: 24px
    color: #777

  .page
    width: 24px
    height: 24px
    margin-right: 4px
    font-size: 90%
    line-height: 24px
    background-color: #777
    color: #fff
    border-radius: 3px
    cursor: pointer

    &:hover
      background-color: #888

    &.active
      color: #777
      background-color: $bg-color
</style>

