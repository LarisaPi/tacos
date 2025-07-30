<template>
<div v-if="hasOrder" class="pago-wrapper">
    <!-- Comprobante de pedido -->
    <div class="pago-contenedor">
    <h1>Comprobante de pedido</h1>
    <p><strong>Cliente:</strong> {{ detalle.nombre_cliente }}</p>
    <p><strong>Teléfono:</strong> {{ detalle.telefono }}</p>
    <p><strong>Fecha:</strong> {{ detalle.fecha }}</p>

    <ul class="resumen">
        <li v-for="(item, i) in sabores" :key="i">
        <img
            :src="item.imagen"
            :alt="item.nombre"
            class="icono-sabor"
        />
        <span class="texto-sabor">
            {{ item.nombre }} x{{ item.cantidad }}
        </span>
        <span class="subtotal">
            {{ formatCurrency(item.precio * item.cantidad) }}
        </span>
        </li>
    </ul>

    <div class="total">
        Total a pagar: <strong>{{ formatCurrency(detalle.total) }}</strong>
      </div>
    </div>

    <!-- Instrucciones de pago con edición -->
    <div class="pago-contenedor pago-banco">
      <h2>Pagar a la cuenta</h2>

      <!-- Modo visual -->
      <div v-if="!isEditing">
        <p><strong>Titular:</strong> {{ bankAccount.titular }}</p>
        <p><strong>Banco:</strong> {{ bankAccount.banco }}</p>
        <p><strong>Cuenta:</strong> {{ bankAccount.numero }}</p>
        <p><strong>CLABE:</strong> {{ bankAccount.clabe }}</p>
        <button class="btn-editar" @click="startEdit">
          ✏️ Editar datos
        </button>
      </div>

      <!-- Modo edición -->
      <form v-else @submit.prevent="saveEdit" class="form-banco">
        <label>
          Titular
          <input v-model="bankAccountDraft.titular" type="text" required />
        </label>
        <label>
          Banco
          <input v-model="bankAccountDraft.banco" type="text" required />
        </label>
        <label>
          Cuenta
          <input v-model="bankAccountDraft.numero" type="text" required />
        </label>
        <label>
          CLABE
          <input v-model="bankAccountDraft.clabe" type="text" required />
        </label>
        <div class="actions">
          <button type="submit" class="btn-guardar">💾 Guardar</button>
          <button type="button" class="btn-cancelar" @click="cancelEdit">
            ❌ Cancelar
          </button>
        </div>
      </form>

      <button class="btn-pagar" @click="sendComprobante">
        Confirmar pago
      </button>

      <!-- Leyenda de captura -->
      <p class="leyenda-captura">
        Recuerda tomar una captura de pantalla de tu comprobante de pago y enviarlo al número que proporcionaste.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter }      from 'vue-router'
import { useOrderStore }  from '../stores/orderStore'
import Swal                from 'sweetalert2'

const router     = useRouter()
const orderStore = useOrderStore()
const order      = orderStore.order

const hasOrder = computed(() => !!order && order.id)
const sabores  = ref([])
const detalle  = ref({ nombre_cliente: '', telefono: '', fecha: '', total: 0 })

// Cuenta bancaria (editable)
const bankAccount = reactive({
  titular: 'Taquería El Buen Taco',
  banco:   'Banco Ficticio',
  numero:  '1234 5678 9012 3456',
  clabe:   '001234567890123456'
})

const bankAccountDraft = reactive({ ...bankAccount })
const isEditing        = ref(false)

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)

onMounted(async () => {
  if (!hasOrder.value) {
    return router.replace({ path: '/' })
  }
  try {
    const [resSab, resCab] = await Promise.all([
      fetch(`http://localhost:3000/api/pedidos/${order.id}/sabores`),
      fetch(`http://localhost:3000/api/pedidos/${order.id}`)
    ])
    if (!resSab.ok || !resCab.ok) {
      throw new Error('Error en las respuestas del servidor')
    }
    sabores.value = await resSab.json()
    detalle.value = await resCab.json()
  } catch (err) {
    console.error(err)
    await Swal.fire('Error', 'No se pudo cargar el comprobante', 'error')
  }
})

function startEdit() {
  Object.assign(bankAccountDraft, bankAccount)
  isEditing.value = true
}

function saveEdit() {
  Object.assign(bankAccount, bankAccountDraft)
  isEditing.value = false
  Swal.fire('Listo', 'Datos de cuenta actualizados', 'success')
}

function cancelEdit() {
  isEditing.value = false
}

async function sendComprobante() {
  await Swal.fire(
    '¡Listo!',
    `El comprobante se ha enviado al ${detalle.value.telefono}`,
    'success'
  )
  // Regresar al carrito
  router.replace({ path: '/' })
}
</script>

<style scoped>
.pago-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 520px;
  margin: 2rem auto;
}

.pago-contenedor {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pago-contenedor h1,
.pago-contenedor h2 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  text-align: center;
  color: #333;
}

.pago-contenedor p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #555;
}

.resumen {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.resumen li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.icono-sabor {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 0.75rem;
}

.texto-sabor {
  flex: 1;
  font-size: 1rem;
  color: #333;
}

.subtotal {
  font-weight: 500;
  font-size: 0.95rem;
  margin-left: auto;
  color: #111;
}

.total {
  margin-top: 1.25rem;
  font-size: 1.2rem;
  text-align: right;
  color: #222;
}

/* Estilos para editar cuenta */
.pago-banco label {
  display: block;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #444;
}
.pago-banco input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-banco .actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn-editar {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-editar:hover {
  background: #1565c0;
}
.btn-guardar,
.btn-cancelar {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}
.btn-guardar {
  background: #4caf50;
  margin-right: 0.5rem;
}
.btn-guardar:hover {
  background: #43a047;
}
.btn-cancelar {
  background: #e53935;
}
.btn-cancelar:hover {
  background: #d32f2f;
}

.btn-pagar {
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #4caf50, #81c784);
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}
.btn-pagar:hover {
  background: linear-gradient(135deg, #388e3c, #66bb6a);
}

/* Leyenda de captura */
.leyenda-captura {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}
</style>