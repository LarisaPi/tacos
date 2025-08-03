<template>
  <div class="estado-pedidos-container">
    <h1>Estado de tus pedidos</h1>

    <div v-if="loading">Cargando pedidos…</div>
    <div v-else-if="error">Ocurrió un error: {{ error.message }}</div>
    <div v-else-if="!pedidos.length">No hay pedidos para mostrar.</div>

    <div
      v-else
      v-for="pedido in pedidos"
      :key="pedido.id"
      class="pedido-bloque"
    >
      <h2>Cliente: {{ pedido.nombre_cliente }}</h2>

      <div class="progress-container">
        <div class="progress-steps">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step"
            :class="{
              active:
                i <= (
                  pedido.estado_id === 5
                    ? pedido.estado_id_original - 1
                    : pedido.estado_id - 1
                )
            }"
          >
            {{ step }}
          </div>
          <div class="progress-bar-background"></div>
          <div
            class="progress-bar"
            :style="{
              width:
                ((pedido.estado_id === 5
                  ? pedido.estado_id_original - 1
                  : pedido.estado_id - 1) /
                  (steps.length - 1)) *
                  100 +
                '%'
            }"
          ></div>
        </div>
      </div>

      <p><strong>Estado:</strong> {{ mostrarEstado(pedido) }}</p>

      <div class="buttons-row">
        <button
          class="cancel-btn"
          @click="cancelarPedido(pedido)"
          :disabled="!canCancel(pedido)"
        >
          Cancelar pedido
        </button>
        <button
          class="advance-btn"
          @click="confirmarEstado(pedido)"
          :disabled="!canAdvance(pedido)"
        >
          <!-- Cambia el texto para el primer paso en vendedor -->
          {{ currentUser.role === 'vendedor' && pedido.estado_id === 1
            ? 'Confirmar pedido'
            : 'Siguiente estado' }}
        </button>
      </div>

      <h3>Información del pedido</h3>
      <p>
        <strong>Cantidad total:</strong>
        {{ pedido.sabores.reduce((acc, s) => acc + (s.cantidad || 0), 0) }}
      </p>
      <p>
        <strong>Dirección:</strong>
        {{ pedido.direccion_calle }}, {{ pedido.direccion_colonia }},
        {{ pedido.direccion_ciudad }}, CP {{ pedido.direccion_cp }}
      </p>
      <p><strong>Teléfono:</strong> {{ pedido.telefono }}</p>
      <p>
        <strong>Fecha:</strong>
        {{ new Date(pedido.fecha).toLocaleString('es-MX') }}
      </p>
      <p><strong>Total:</strong> ${{ (pedido.total ?? 0).toFixed(2) }}</p>

      <h3>Sabores</h3>
      <ul>
        <li v-for="(sabor, idx) in pedido.sabores" :key="idx">
          {{ sabor.nombre }} – {{ sabor.cantidad }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'EstadoPedidos',
  data() {
    return {
      steps: ['Recibido', 'En Preparación', 'En camino', 'Entregado'],
      pedidos: [],
      loading: false,
      error: null,
      currentUser: JSON.parse(
        localStorage.getItem('currentUser') ||
          JSON.stringify({ role: 'admin', id: 0 })
      )
    }
  },
  methods: {
    canCancel(pedido) {
      const { role } = this.currentUser
      if (role === 'admin') return true
      if (role === 'cliente') return pedido.estado_id < 4
      return false
    },
    canAdvance(pedido) {
      const { role } = this.currentUser
      // cálculo de siguiente paso
      const siguiente =
        pedido.estado_id === 1 && role === 'vendedor'
          ? 2
          : pedido.estado_id + 1

      if (pedido.estado_id === 5) return false
      if (role === 'admin') return siguiente <= this.steps.length
      if (role === 'vendedor') return siguiente <= 3
      if (role === 'cliente') return siguiente === 4
      return false
    },
    async obtenerPedidos() {
      this.loading = true
      this.error = null

      try {
        const { role, id } = this.currentUser
        let url = '/api/pedidos'

        if (role === 'vendedor') {
          url = `/api/pedidos/vendedor/${id}`
        } else if (role === 'cliente') {
          url = `/api/pedidos/usuario/${id}`
        }

        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const lista = await res.json()

        const withSabores = await Promise.all(
          (lista || []).map(async p => {
            // agregamos estado original por si cancela
            const pedido = { ...p, estado_id_original: p.estado_id }
            try {
              const rs = await fetch(`/api/pedidos/${pedido.id}/sabores`)
              pedido.sabores = rs.ok ? await rs.json() : []
            } catch {
              pedido.sabores = []
            }
            return pedido
          })
        )

        this.pedidos = withSabores
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async confirmarEstado(pedido) {
      if (!this.canAdvance(pedido)) return

      // definimos correctamente el siguiente paso
      const siguiente =
        pedido.estado_id === 1 && this.currentUser.role === 'vendedor'
          ? 2
          : pedido.estado_id + 1

      const { isConfirmed } = await Swal.fire({
        title: `Pasar a "${this.steps[siguiente - 1]}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      })
      if (!isConfirmed) return

      try {
        const res = await fetch(`/api/pedidos/${pedido.id}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado_id: siguiente })
        })
        if (!res.ok) throw new Error()
        pedido.estado_id = siguiente
        Swal.fire('¡Hecho!', '', 'success')
      } catch {
        Swal.fire('Error', 'No se pudo actualizar.', 'error')
      }
    },
    async cancelarPedido(pedido) {
      if (!this.canCancel(pedido)) return

      const { isConfirmed } = await Swal.fire({
        title: '¿Cancelar pedido?',
        text: 'No podrás revertir esto.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
      })
      if (!isConfirmed) return

      try {
        pedido.estado_id_original = pedido.estado_id
        const res = await fetch(`/api/pedidos/${pedido.id}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado_id: 5 })
        })
        if (!res.ok) throw new Error()
        pedido.estado_id = 5
        Swal.fire('Cancelado', '', 'success')
      } catch {
        Swal.fire('Error', 'No se pudo cancelar.', 'error')
      }
    },
    mostrarEstado(pedido) {
      const labels = [
        'Recibido',
        'En Preparación',
        'En camino',
        'Entregado',
        'Cancelado'
      ]
      const actual =
        pedido.estado_id === 5
          ? pedido.estado_id_original
          : pedido.estado_id

      return pedido.estado_id === 5
        ? `Cancelado (estaba en ${labels[actual - 1]})`
        : labels[actual - 1]
    }
  },
  mounted() {
    this.obtenerPedidos()
  }
}
</script>


<style scoped>
.pedido-bloque {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 10px;
  background-color: #f8f8f8;
}

.buttons-row {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cancel-btn {
  font-family: 'roboto', sans-serif;
  background-color: #d33;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button {
  font-family: 'roboto', sans-serif;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* progreso */
.progress-container {
  margin-bottom: 1rem;
}

.progress-steps {
  font-family: 'roboto', sans-serif;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.step {
  text-align: center;
  width: 25%;
  color: gray;
  z-index: 2;
}

.step::before {
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid gray;
  border-radius: 50%;
  background-color: white;
  margin: 0 auto 5px auto;
}

.step.active {
  color: green;
}

.step.active::before {
  border-color: green;
  background-color: green;
}

.progress-bar-background {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: #ccc;
  z-index: 1;
  border-radius: 10px;
}

.progress-bar {
  position: absolute;
  top: 10px;
  left: 0;
  height: 6px;
  background-color: green;
  z-index: 1;
  border-radius: 10px;
  transition: width 0.3s ease;
}

/* estilos para sabores igual que párrafos */
.pedido-bloque ul {
  list-style: none;
  padding-left: 50px;
  font-family: 'roboto', sans-serif;
  margin-bottom: 1rem;
}
.pedido-bloque ul li {
  margin-bottom: 0.5rem;
}
</style>
