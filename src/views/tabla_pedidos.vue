<template>
  <div class="tabla-pedidos">
    <h2>Lista de Pedidos</h2>
    <div class="search-bar">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por ID o Cliente"
        aria-label="Buscar pedidos"
      />
    </div>

    <div v-if="loading" class="p-4">Cargando pedidos…</div>
    <div v-else-if="error" class="p-4 text-red-600">{{ error }}</div>

    <div v-else class="overflow-x-auto">
      <table class="pedidos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sabores</th>
            <th>Cant.</th>
            <th>Estado</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Ubicación</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pedidosFiltrados" :key="p.id_pedido">
            <td>#{{ p.id_pedido }}</td>
            <td>
              <div v-for="(item, i) in p.items" :key="i" class="sabor-item">
                {{ item.sabor }}
              </div>
            </td>
            <td>
              <div v-for="(item, i) in p.items" :key="i" class="cantidad-item">
                {{ item.cantidad }}
              </div>
            </td>
            <td>{{ p.estado_envio }}</td>
            <td>{{ p.cliente }}</td>
            <td>{{ p.vendedor || "–" }}</td>
            <td>{{ p.telefono_cliente }}</td>
            <td>{{ p.fecha_hora }}</td>
            <td class="ubicacion-cell">
              <pre>{{ formatUbicacion(p.ubicacion) }}</pre>
            </td>
            <td>{{ p.total != null ? "$" + p.total.toFixed(2) : "–" }}</td>
          </tr>
          <tr v-if="!pedidosFiltrados.length && !loading">
            <td colspan="10" class="center">No hay resultados para "{{ busqueda }}".</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const rol = route.params.rol;
const userId = route.params.id;

const pedidos = ref([]);
const busqueda = ref("");
const loading = ref(false);
const error = ref(null);

async function fetchPedidos() {
  loading.value = true;
  error.value = null;
  try {
    const ruta = route.params.nombre
      ? `/api/pedidos/full/${rol}/${userId}/${encodeURIComponent(route.params.nombre)}`
      : `/api/pedidos/full/${rol}/${userId}`;

    const res = await fetch(ruta);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    pedidos.value = await res.json();
    console.log("Pedidos cargados:", pedidos.value);
  } catch (e) {
    error.value = "Error al cargar pedidos: " + e.message;
  } finally {
    loading.value = false;
  }
}

function formatUbicacion(u) {
  return u ? u.replace(/, /g, "\n").replace(/\sCP\s/, "\nCP ") : "–";
}

const pedidosFiltrados = computed(() => {
  const t = busqueda.value.trim().toLowerCase();
  console.log("Buscando:", t);
  if (!t) {
    console.log("Sin filtro, mostrando todos:", pedidos.value.length);
    return pedidos.value;
  }
  const filtrados = pedidos.value.filter((p) => {
    const idStr = p.id_pedido.toString();
    const clienteStr = (p.cliente || "").toLowerCase();
    const match = idStr.includes(t) || clienteStr.includes(t);
    console.log(`ID: ${idStr}, Cliente: ${clienteStr}, Coincide: ${match}`);
    return match;
  });
  console.log("Filtrados:", filtrados.length);
  return filtrados;
});

onMounted(fetchPedidos);
</script>

<style scoped>
.tabla-pedidos {
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
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

th,
td {
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
