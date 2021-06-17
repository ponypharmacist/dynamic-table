<template lang="pug">

.dynamic-table
  // Фильтры и поиск
  .filters
    input.dynamic-table-search(
      v-model="searchQuery"
      placeholder="Поиск"
    )

    // Фильтры
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
          .cell-content
            span {{ column.title }}

            // Сортировка
            .sorter(
              v-if="sortableColumns.find((c) => c.key === column.key)"
              @click="toggleSort(column.key)"
            ) 
              span(v-if="sorter === column.key") {{ sorterDirection === 'up' ? '↑' : sorterDirection === 'down' ? '↓' : '↕️' }}
              span(v-else) ↕️

    // Ячейки в строках
    tbody.dynamic-table-body
      tr(v-for="row in pageContent")
        td(v-for="column in columns")
          slot(:name="`item.${column.key}`" :item="row") {{ row[column.key] || '-' }}

      // Если ничего не нашли/не нафильтровали
      tr
        td.not-found(
          v-if="!filteredItems.length"
          :colspan="columns.length"
        ) Ничего не найдено

  // Странички
  .dynamic-table-pagination
    template(v-if="filteredItems.length")
      .pagination-left
        .pagination-text Страничка:
        
          span.pagination-prev(
            :class="{ disabled: pageCurrent === 1 }"
            @click="() => pageCurrent > 1 && pageCurrent--"
          ) &larr;
          
          | {{ pageCurrent }} из {{ pagesCount }}

          span.pagination-next(
            :class="{ disabled: pageCurrent === pagesCount }"
            @click="() => pageCurrent < pagesCount && pageCurrent++"
          ) &rarr;

      .pagination-right
        .pagination-text {{ itemsRangeOnPage }} из {{ filteredItems.length }}

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
    // Создаем список отфильтрованых и сортированых элементов
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

    // Выделяем содержимое текущей страницы из списка элементов
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
    },

    itemsRangeOnPage() {
      const from = (this.pageCurrent - 1) * this.itemsPerPage + 1
      const to = this.pageCurrent * this.itemsPerPage > this.filteredItems.length ? this.filteredItems.length : this.pageCurrent * this.itemsPerPage

      return `${from} - ${to}`
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

    // Сортировщик пытается на глазок оценить какой тип данных в столбце и применяет соответствующую сортировку 
    sorterAlgo(varA, varB) {
      const sortUp = this.sorterDirection === 'up'
      const sortDown = this.sorterDirection === 'down'

      const a = varA[this.sorter]
      const b = varB[this.sorter]

      if (typeof this.items[0][this.sorter] === 'number') {
        if (sortUp) return a - b
        if (sortDown) return b - a
      }

      if (typeof this.items[0][this.sorter] === 'string') {
        if (a.toUpperCase() < b.toUpperCase()) {
          return sortUp ? -1 : 1
        }
        else if (a.toUpperCase() > b.toUpperCase()) return sortUp ? 1 : -1
        else return 0
      }
    },

    // Cброс фильтров
    resetFilters() {
      this.pageCurrent = 1
      this.searchQuery = null
      this.filters = []
      this.sorter = null
      this.sorterDirection = null

      this.filterableColumns.forEach((filter) => {
        this.filters.push({ key: filter.key, value: null })
      })
    }
  }
}
</script>

<style lang="sass" scoped>
$bg-color: #eee

// Таблица
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
  
  .cell-content
    display: flex

  .not-found
    text-align: center

// Сортировка
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
  height: 24px
  padding-top: 10px
  background-color: $bg-color

  .pagination-left

  .pagination-right
    margin-left: auto

  .pagination-text
    height: 24px
    margin-right: 4px
    font-size: 90%
    line-height: 24px
    color: #777

  .pagination-prev,
  .pagination-next
    display: inline-block
    width: 26px
    height: 24px
    margin: 0 6px
    line-height: 24px
    text-align: center
    background-color: #fff
    border-radius: 3px
    cursor: pointer

    &:hover
      background-color: #fafafa

    &.disabled
      background-color: $bg-color
      color: #bbb
      cursor: default
</style>

