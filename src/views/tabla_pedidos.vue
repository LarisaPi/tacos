<template>
  <div class="tabla-pedidos">
    <header class="tabla-header">
      <h2>Lista de Pedidos</h2>
      <div class="search-bar">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por ID o Cliente"
          aria-label="Buscar pedidos"
        />
      </div>
    </header>

    <div v-if="loading" class="p-4">Cargando pedidos…</div>
    <div v-else-if="error" class="p-4 text-red-600">{{ error }}</div>

    <div v-else class="overflow-x-auto">
      <table class="pedidos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sabores</th>
            <th>Cantidades</th>
            <th>Estado envío</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Fecha y Hora</th>
            <th>Ubicación</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pedidosFiltrados" :key="p.id_pedido">
            <td>#{{ p.id_pedido }}</td>
            <td>
              <div v-for="(item, i) in p.items" :key="i" class="sabor-item">{{ item.sabor }}</div>
            </td>
            <td>
              <div v-for="(item, i) in p.items" :key="i" class="cantidad-item">{{ item.cantidad }}</div>
            </td>
            <td>{{ p.estado_envio }}</td>
            <td>{{ p.cliente }}</td>
            <td>{{ p.telefono_cliente }}</td>
            <td>{{ p.fecha_hora }}</td>
            <td class="ubicacion-cell">
              <pre>{{ formatUbicacion(p.ubicacion) }}</pre>
            </td>
            <td>{{ p.total != null ? '$' + p.total.toFixed(2) : '–' }}</td>
          </tr>
          <tr v-if="!pedidosFiltrados.length && !loading">
            <td class="center" colspan="9">No hay resultados para "{{ busqueda }}".</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const pedidos = ref([])
const busqueda = ref('')
const loading = ref(false)
const error = ref(null)

async function fetchPedidos() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:3000/api/pedidos/full')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    pedidos.value = await res.json()
  } catch (e) {
    error.value = 'Error al cargar pedidos: ' + e.message
  } finally {
    loading.value = false
  }
}

function formatUbicacion(ubicacion) {
  if (!ubicacion) return '–'
  return ubicacion.replace(/, /g, '\n').replace(/\sCP\s/, '\nCP ')
}

const pedidosFiltrados = computed(() => {
  const term = busqueda.value.trim().toLowerCase()
  if (!term) return pedidos.value
  return pedidos.value.filter(p => {
    const cliente = p.cliente ?? ''
    const id = String(p.id_pedido ?? '')
    return id.includes(term) || cliente.toLowerCase().includes(term)
  })
})

onMounted(fetchPedidos)
</script>

<style scoped>
.tabla-pedidos {
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-bar {
  display: flex;
  background: white;
  border-radius: 10px;
  padding: 5px 10px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  max-width: 300px;
  flex-grow: 1;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  outline: none;
}

.pedidos-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  vertical-align: top;
}

.pedidos-table thead th {
  background-color: #56aaef;
  color: #fff;
  text-align: left;
}

tbody tr:hover {
  background: #f9fafb;
}

.center {
  text-align: center;
}

.sabor-item,
.cantidad-item {
  margin-bottom: 0.25rem;
}

.ubicacion-cell {
  white-space: pre-line;
}
</style>