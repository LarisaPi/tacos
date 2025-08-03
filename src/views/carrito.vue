<template>
  <div class="app-container">
    <header>
      <h1>Carrito</h1>
    </header>

    <div class="card-grid">
      <FoodCard
        v-for="(item, index) in carrito.items"
        :key="index"
        :food="item"
        :index="index"
        :isHighlighted="index % 2 === 1"
        @remove="removeItem"
        @update-qty="updateQty"
      />
    </div>

    <div class="button-container">
      <button class="pedido" @click="realizarPedido">Realizar pedido</button>
    </div>
  </div>
</template>

<script setup>
import FoodCard from '../components/FoodCard.vue'
import { useCarritoStore } from '../stores/carrito'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const carrito = useCarritoStore()
const router  = useRouter()

const realizarPedido = async () => {
  if (carrito.items.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'El carrito está vacío',
      text: 'Agrega al menos un producto antes de continuar.'
    })
    return
  }

  const { isConfirmed } = await Swal.fire({
    title: '¿Continuar al formulario?',
    text: 'Se te redirigirá para completar los datos de tu pedido.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar'
  })
  if (!isConfirmed) return

  // <-- LEEMOS AQUÍ -->
  let currentUser = null
  try {
    currentUser = JSON.parse(localStorage.getItem('currentUser'))
  } catch {
    currentUser = null
  }
  const userId = currentUser?.id

  if (!userId) {
    await Swal.fire({
      icon: 'error',
      title: 'No has iniciado sesión',
      text: 'Debes iniciar sesión antes de realizar un pedido.'
    })
    return router.push({ name: 'InicioSesion', query: { redirect: '/form_pedido' } })
  }

  // Rediriges al formulario con id de usuario
  router.push({
    name: 'FormPedido',
    params: { id: userId }
  })
}

const removeItem = (index) => carrito.eliminarItem(index)
const updateQty = (index, qty) => {
  if (qty >= 50) carrito.actualizarCantidad(index, qty)
  else Swal.fire({ icon: 'info', title: 'Cantidad mínima', text: 'La cantidad mínima es 50 por sabor.' })
}

</script>



<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

@media screen and (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}

.button-container {
  text-align: right;
  padding-right: 30px;
}

.pedido {
  background-color: #26ff00;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

h1 {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin: 0;
}
</style>