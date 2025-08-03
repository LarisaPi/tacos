<template>
  <div class="contenedor">
    <h1>Datos para el pedido</h1>

    <!-- Datos personales -->
    <div class="grupo">
      <div class="campo">
        <label>Nombre</label>
        <input type="text" v-model="nombre" placeholder="Escribe tu nombre..." />
      </div>
      <div class="campo">
        <label>Teléfono</label>
        <input type="text" v-model="telefono" placeholder="Escribe tu teléfono..." />
      </div>
    </div>

    <div class="campo campo-grande">
      <label>Correo electrónico</label>
      <input type="email" v-model="correo" placeholder="Escribe tu correo..." />
    </div>

    <!-- Dirección -->
    <h3>Dirección</h3>
    <div class="grupo">
      <div class="campo">
        <label>Calle</label>
        <input type="text" v-model="calle" placeholder="Ej. Av. Reforma" />
      </div>
      <div class="campo">
        <label>Ciudad</label>
        <input type="text" v-model="ciudad" placeholder="Ej. Ciudad de México" />
      </div>
    </div>

    <div class="grupo">
      <div class="campo">
        <label>Código Postal</label>
        <input type="text" v-model="cp" placeholder="Ej. 06000" />
      </div>
      <div class="campo">
        <label>Estado / Provincia / Zona</label>
        <input type="text" v-model="estado" placeholder="Ej. CDMX" />
      </div>
    </div>

    <div class="grupo">
      <div class="campo">
        <label>Colonia</label>
        <input type="text" v-model="colonia" placeholder="Ej. Centro" />
      </div>
      <div class="campo">
        <label>Entre calles</label>
        <input type="text" v-model="calles" placeholder="Ej. Juárez y Madero" />
      </div>
    </div>

    <!-- Fecha de entrega -->
    <h3>Fecha de entrega</h3>
    <div class="grupo">
      <div class="campo">
        <label>Fecha</label>
        <input type="date" v-model="fecha" />
      </div>
      <div class="campo">
        <label>Hora</label>
        <input type="time" v-model="hora" />
      </div>
    </div>

    <!-- Confirmación -->
    <div class="acciones">
      <button class="confirmar" @click="onConfirm">Confirmar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarritoStore } from '../stores/carrito'
import { useOrderStore } from '../stores/orderStore'
import Swal from 'sweetalert2'

const route      = useRoute()
const router     = useRouter()
const carrito    = useCarritoStore()
const orderStore = useOrderStore()

// v-models
const nombre   = ref('')
const telefono = ref('')
const correo   = ref('')
const calle    = ref('')
const ciudad   = ref('')
const cp       = ref('')
const estado   = ref('')
const colonia  = ref('')
const calles   = ref('')
const fecha    = ref('')
const hora     = ref('')

// obtenemos el id del cliente de la URL
const userId = Number(route.params.id)

async function onConfirm() {
  const { isConfirmed } = await Swal.fire({
    title: '¿Confirmar pedido?',
    text: 'Se enviará tu pedido con estos datos.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, enviar'
  })
  if (!isConfirmed) return

  // armamos el pedido
  const productos = carrito.items.map(i => ({ id_taco: i.id, cantidad: i.qty }))
  const total     = carrito.items.reduce((sum, i) => sum + (i.precio || 0)*i.qty, 0)

  const payload = {
    id_cliente:    userId,
    nombre:        nombre.value,
    telefono:      telefono.value,
    correo:        correo.value,
    direccion: {
      calle:   calle.value,
      colonia: colonia.value,
      ciudad:  ciudad.value,
      cp:      cp.value,
      estado:  estado.value,
      calles:  calles.value
    },
    fecha_entrega: fecha.value,
    hora_entrega:  hora.value,
    productos,
    total
  }

  try {
    const res = await fetch('/api/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    await Swal.fire('¡Éxito!', 'Tu pedido fue enviado.', 'success')

    // guardamos en Pinia y limpiamos carrito
    orderStore.setOrder({ id: data.id_pedido, name: nombre.value, total })
    carrito.vaciarCarrito()

    // sólo push al nombre de ruta Pago
    router.push({ name: 'Pago' })
  } catch (err) {
    await Swal.fire('Error', err.message, 'error')
  }
}
</script>



<style scoped>

input[type="email"] {
  padding: 18px 20px;
  font-size: 16px;
  border: 1.6px solid #aaa;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;
}
.contenedor {
  max-width: 950px;
  margin: 30px auto;
  padding: 30px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
}

h1 {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
}

h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 30px 0 10px;
}

.grupo {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.campo {
  flex: 1;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.campo-grande {
  width: 100%;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
}

input[type="text"],
input[type="number"],
input[type="date"],
input[type="time"] {
  padding: 14px 18px;
  font-size: 16px;
  border: 1.6px solid #aaa;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #9e5700;
  outline: none;
}

.acciones {
  margin-top: 40px;
  text-align: center;
}

.confirmar {
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background-color: #26ff00;
  color: #000;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 0 8px #26ff00aa;
}

.confirmar:hover {
  background-color: #20cc00;
  box-shadow: 0 0 12px #20cc00cc;
}

@media (max-width: 768px) {
  .grupo {
    flex-direction: column;
  }

  .campo {
    min-width: 100%;
  }

  .confirmar {
    width: 100%;
  }
}
</style>