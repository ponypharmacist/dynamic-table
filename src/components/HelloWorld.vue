<template lang="pug">

div(class="hello")
  dynamic-table(
    :items="tableItems"
    :columns="tableColumns"
    :items-per-page="5"
  )

</template>

<script>
import dynamicTable from './table/dynamicTable'

export default {
  name: 'HelloWorld',

  components: {
    dynamicTable
  },

  data() {
    return {
      // Список элементов для таблицы
      tableItems: [
        { name: 'Морковь', weight: 10, colour: 'red', stock: 2000, description: 'Описание, которое не выводится' },
        { name: 'Яблоко', weight: 25, colour: 'green', stock: 1300, description: 'Описание, которое не выводится' },
        { name: 'Капуста', weight: 680, colour: 'green', stock: 325, description: 'Описание, которое не выводится' },
        { name: 'Баклажан', weight: 230, colour: 'purple', stock: 325, description: 'Описание, которое не выводится' },
        { name: 'Лучок', weight: 5, colour: 'purple', stock: 4025, description: 'Описание, которое не выводится' },
        { name: 'Укропчик', weight: 1, colour: 'green', stock: 25, description: 'Описание, которое не выводится' },
        { name: 'Морковь', weight: 10, colour: 'green', stock: 2000, description: 'Описание, которое не выводится' },
        { name: 'Яблоко', weight: 25, colour: 'green', stock: 1300, description: 'Описание, которое не выводится' },
        { name: 'Капуста', weight: 680, colour: 'green', stock: 325, description: 'Описание, которое не выводится' },
        { name: 'Баклажан', weight: 230, colour: 'purple', stock: 325, description: 'Описание, которое не выводится' },
        { name: 'Лучок', weight: 5, colour: 'purple', stock: 4025, description: 'Описание, которое не выводится' },
        { name: 'Укропчик', weight: 1, colour: 'green', stock: 25, description: 'Описание, которое не выводится' }
      ],
      // Определение, какие столбцы следует применить к списку элементов
      // filterable - создает фильтр в таблице
      // sortable - включает сортировку столбца в таблице
      tableColumns: [
        { key: 'name', title: 'Название' },
        { key: 'weight', title: 'Вес', sortable: true, filterable: true },
        { key: 'colour', title: 'Цвет', filterable: true },
        { key: 'stock', title: 'Склад', sortable: true }
      ]
    }
  }
}
</script>
