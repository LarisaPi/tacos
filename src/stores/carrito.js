import { defineStore } from 'pinia'

// Recuperar desde localStorage
const savedItems = JSON.parse(localStorage.getItem('carrito_items')) || []

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    items: savedItems
  }),

  actions: {
    agregarAlCarrito(food) {
      if (food.qty < 50) return // Evita agregar cantidades menores a 50

      const existe = this.items.find(item => item.title === food.title)
      if (!existe) {
        this.items.push({ ...food })
        this.guardarEnLocalStorage()
      }
    },
    actualizarCantidad(index, nuevaCantidad) {
      if (nuevaCantidad < 50) return
      this.items[index].qty = nuevaCantidad
      this.guardarEnLocalStorage()
    },
    eliminarItem(index) {
      this.items.splice(index, 1)
      this.guardarEnLocalStorage()
    },
    guardarEnLocalStorage() {
      localStorage.setItem('carrito_items', JSON.stringify(this.items))
    }
  }
})