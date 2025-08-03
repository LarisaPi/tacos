// stores/orderStore.js
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: null // { id, name, total }
  }),
  actions: {
    setOrder(o) {
      this.order = o
    },
    clearOrder() {
      this.order = null
    }
  },
  persist: true // 👈 esta línea habilita persistencia
})