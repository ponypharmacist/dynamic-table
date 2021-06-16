export default {
  namespaced: true,

  state: {
    vegetables: [
      { id: 1, name: 'Морковь', weight: 10, colour: 'red', stock: 2000, description: 'Описание, которое не выводится' },
      { id: 2, name: 'Яблоко', weight: 25, colour: 'green', stock: 1300, description: 'Описание, которое не выводится' },
      { id: 3, name: 'Капуста', weight: 680, colour: 'green', stock: 325, description: 'Описание, которое не выводится' },
      { id: 4, name: 'Баклажан', weight: 230, colour: 'purple', stock: 325, description: 'Описание, которое не выводится' },
      { id: 5, name: 'Лучок', weight: 5, colour: 'purple', stock: 4025, description: 'Описание, которое не выводится' },
      { id: 6, name: 'Укропчик', weight: 1, colour: 'green', stock: 25, description: 'Описание, которое не выводится' },
      { id: 7, name: 'Морковь', weight: 10, colour: 'green', stock: 2000, description: 'Описание, которое не выводится' },
      { id: 8, name: 'Яблоко', weight: 25, colour: 'green', stock: 1300, description: 'Описание, которое не выводится' },
      { id: 9, name: 'Капуста', weight: 680, colour: 'green', stock: 325, description: 'Описание, которое не выводится' },
      { id: 10, name: 'Баклажан', weight: 230, colour: 'purple', stock: 325, description: 'Описание, которое не выводится' },
      { id: 11, name: 'Лучок', weight: 5, colour: 'purple', stock: 4025, description: 'Описание, которое не выводится' },
      { id: 12, name: 'Укропчик', weight: 1, colour: 'green', stock: 25, description: 'Описание, которое не выводится' }
    ]
  },

  getters: {
    vegetables(state) {
      return state.vegetables
    }
  },

  mutations: {
    removeVegetable(state, id) {
      const index = state.vegetables.findIndex((v) => v.id === id)

      state.vegetables.splice(index, 1)
    }
  }
}
