import { defineStore } from 'pinia'

// 🛠️ Normalizamos los ítems recuperados de localStorage
const rawItems = JSON.parse(localStorage.getItem('carrito_items')) || []

const savedItems = rawItems.map(item => {
  const qtyValido = typeof item.qty === 'number' && item.qty >= 50
  return {
    ...item,
    qty: qtyValido ? item.qty : 50
  }
})

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    items: savedItems
  }),

  actions: {
    agregarAlCarrito(food) {
      if (food.qty < 50) return // Evita agregar cantidades menores a 50

      const existe = this.items.find(item => item.id === food.id)

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
    },
    vaciarCarrito() {
      this.items = []
      this.guardarEnLocalStorage()
    }
  }
})