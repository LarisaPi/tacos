<template>
  <div class="asignador-container">
    <div class="tablas-superiores">
      <!-- Pedidos pendientes -->
      <div class="tabla pedidos">
        <h3>Pedidos</h3>
        <ul>
          <li v-for="p in pedidos" :key="p.id">
            Pedido #{{ p.id }} — {{ p.nombre_cliente }}
          </li>
        </ul>
        <p v-if="!pedidos.length" class="vacio">
          No hay pedidos pendientes.
        </p>
      </div>

      <!-- Ruleta -->
      <div class="tabla ruleta">
        <h3>🎡 Ruleta</h3>
        <div class="ruleta-circulo" :class="{ girando: animando }">
          <span class="emoji">🌮</span>
        </div>
        <button
          class="boton girar"
          @click="girarRuleta"
          :disabled="animando || !pedidos.length || !vendedores.length"
        >
          {{ animando ? 'Girando…' : 'Girar' }}
        </button>
        <div v-if="seleccion.pedido && !animando" class="resultado">
          Pedido #{{ seleccion.pedido.id }} — {{ seleccion.pedido.nombre_cliente }}
          <br />
          Asignado a <strong>{{ seleccion.trabajador }}</strong>
        </div>
      </div>

      <!-- Vendedores -->
      <div class="tabla vendedores">
        <h3>Vendedores</h3>
        <ul>
          <li v-for="v in vendedores" :key="v">{{ v }}</li>
        </ul>
        <p v-if="!vendedores.length" class="vacio">
          No hay vendedores registrados.
        </p>
      </div>
    </div>

    <!-- Asignaciones vigentes -->
    <div class="tabla asignaciones">
      <h3>Asignaciones</h3>
      <table class="asignaciones-table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Vendedor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(a, i) in asignaciones" :key="i">
            <td>#{{ a.pedido.id }}</td>
            <td>{{ a.trabajador }}</td>
            <td>
              <span v-if="a.confirmado">✅ Confirmado</span>
              <span v-else>🕒 Pendiente</span>
            </td>
            <td class="acciones-td">
              <button
                v-if="!a.confirmado"
                class="boton secundario"
                @click="reasignar(i)"
              >
                Reasignar
              </button>
              <button
                v-if="!a.confirmado"
                class="boton confirmar"
                @click="confirmar(i)"
              >
                Confirmar
              </button>
            </td>
          </tr>
          <tr v-if="!asignaciones.length">
            <td colspan="4" class="vacio">Sin asignaciones aún.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const API = 'http://localhost:3000/api'

const pedidos      = ref([])
const vendedores   = ref([])
const asignaciones = ref([])
const seleccion    = ref({ pedido: null, trabajador: null })
const animando     = ref(false)

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

async function cargarPedidos() {
  const all = await fetchJson(`${API}/pedidos`)
  pedidos.value = all
    .filter(p => p.estado_id === 1)
    .map(p => ({ id: p.id, nombre_cliente: p.nombre_cliente }))
}

async function cargarVendedores() {
  vendedores.value = await fetchJson(`${API}/vendedores`)
}

async function cargarAsignaciones() {
  const data = await fetchJson(`${API}/asignaciones`)
  asignaciones.value = data.map(a => ({
    pedido:       { id: a.pedido_id, nombre_cliente: a.nombre_cliente },
    trabajador:   a.trabajador,
    confirmado:   a.confirmado
  }))
}

onMounted(async () => {
  try {
    await Promise.all([
      cargarPedidos(),
      cargarVendedores(),
      cargarAsignaciones()
    ])
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'No se pudo cargar los datos', 'error')
  }
})

async function girarRuleta() {
  animando.value = true
  setTimeout(async () => {
    const pedido    = pedidos.value[Math.floor(Math.random() * pedidos.value.length)]
    const trabajador = vendedores.value[Math.floor(Math.random() * vendedores.value.length)]

    await fetchJson(
      `${API}/pedidos/asignar/${pedido.id}`,
      {
        method: 'POST',
        body: JSON.stringify({ trabajador })
      }
    )

    seleccion.value = { pedido, trabajador }
    await Promise.all([cargarPedidos(), cargarAsignaciones()])
    animando.value = false
  }, 1400)
}

async function confirmar(index) {
  const { pedido, trabajador } = asignaciones.value[index]
  const { isConfirmed } = await Swal.fire({
    title: '¿Confirmar asignación?',
    text: `Pedido #${pedido.id} → ${trabajador}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar'
  })
  if (!isConfirmed) return

  await fetchJson(`${API}/pedidos/confirmar/${pedido.id}`, { method: 'POST' })
  await Promise.all([cargarPedidos(), cargarAsignaciones()])
  Swal.fire('¡Confirmado!', 'Asignación registrada.', 'success')
}

function reasignar(index) {
  const nuevo = vendedores.value[
    Math.floor(Math.random() * vendedores.value.length)
  ]
  asignaciones.value[index].trabajador = nuevo
}
</script>


<style scoped>
.asignador-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.tablas-superiores {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
}

/* Reducir alto de listas laterales */
.tabla.pedidos,
.tabla.vendedores {
  max-height: 260px;
  overflow-y: auto;
}

.tabla {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
}

.tabla.asignaciones {
  width: 100%;
}

.asignaciones-table {
  width: 100%;
  border-collapse: collapse;
}

.asignaciones-table th,
.asignaciones-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
  white-space: nowrap;
  font-size: 0.9rem;
}

.asignaciones-table th {
  background: #f0f7ff;
}

.ruleta {
  text-align: center;
}

.ruleta-circulo {
  width: 100px;
  height: 100px;
  margin: 1rem auto;
  border: 6px solid #e91e63;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0f6;
  transition: transform 1.4s ease;
}

.ruleta-circulo.girando {
  transform: rotate(1080deg);
}

.emoji {
  font-size: 2rem;
}

.resultado {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #4caf50;
}

.boton {
  padding: 0.4rem 0.8rem;
  margin: 0.3rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.girar {
  background: #2196f3;
  color: #fff;
}

.confirmar {
  background: #4caf50;
  color: #fff;
}

.secundario {
  background: #ff9800;
  color: #fff;
}
</style>