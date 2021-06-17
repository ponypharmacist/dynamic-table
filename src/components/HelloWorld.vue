<template lang="pug">

div(class="hello")
  dynamic-table(
    :items="vegetables"
    :columns="tableColumns"
    :items-per-page="5"
  )
    template(#item.weight="{ item }")
      | {{ item.weight }} g.

    // Действия с объектами
    template(#item.actions="{ item }")
      span.remove-button(@click="removeVegetable(item.id)") Remove

  .intro
    h2 О таблице
    p Использование:
    pre
      | dynamic-table(
      |  :items="items"       - массив элементов
      |  :columns="columns"   - определения столбцов
      |  :items-per-page="5"  - количество элементов на страницу
      | )

    p Определения столбцов:
    pre
      | [
      |   {
      |     key: 'name',        - название параметра в элементе
      |     title: 'Название',  - человеческое название столбца
      |     sortable: true,     - включение опции сортировки
      |     filterable: true,   - включение опции фильтрации
      |   },
      |   ...
      | ]

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import dynamicTable from './table/dynamicTable'

export default {
  name: 'HelloWorld',

  components: {
    dynamicTable
  },

  data() {
    return {
      // Определение, какие столбцы следует применить к списку элементов
      // filterable - создает фильтр в таблице
      // sortable - включает сортировку столбца в таблице
      tableColumns: [
        { key: 'name', title: 'Название', sortable: true },
        { key: 'weight', title: 'Вес', sortable: true, filterable: true },
        { key: 'colour', title: 'Цвет', filterable: true },
        { key: 'stock', title: 'Склад' },
        { key: 'actions', title: '-' }
      ]
    }
  },

  computed: {
    ...mapGetters({
      // Список элементов для таблицы
      vegetables: 'dynamicTable/vegetables'
    })
  },

  methods: {
    ...mapMutations({
      removeVegetable: 'dynamicTable/removeVegetable'
    })
  }
}
</script>

<style lang="sass" scoped>
.intro
  width: 600px
  margin: 0 auto 100px
  text-align: left

  p
    margin-bottom: 8px

.remove-button
  text-decoration: underline
  cursor: pointer
</style>
