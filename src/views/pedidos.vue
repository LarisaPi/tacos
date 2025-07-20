<template>
  <div class="asignador-container">
    <div class="tablas-superiores">
      <!-- Pedidos -->
      <div class="tabla pedidos">
        <h3>Pedidos</h3>
        <ul>
          <li v-for="pedido in pedidos" :key="pedido.id">
            Pedido #{{ pedido.id }} — {{ pedido.cantidad }} tacos
          </li>
        </ul>
      </div>

      <!-- Ruleta -->
      <div class="ruleta">
        <h3>🎡 Ruleta</h3>
        <div class="ruleta-circulo" :class="{ girando: animando }">
          <span class="emoji">🌮</span>
        </div>
        <button class="boton girar" @click="girarRuleta" :disabled="animando">Girar</button>
        <div v-if="seleccion.pedido && seleccion.trabajador && !animando" class="resultado">
          <p>Pedido #{{ seleccion.pedido.id }} asignado a {{ seleccion.trabajador }}</p>
        </div>
      </div>

      <!-- Trabajadores -->
      <div class="tabla trabajadores">
        <h3>Trabajadores</h3>
        <ul>
          <li v-for="(t, i) in trabajadores" :key="i">{{ t }}</li>
        </ul>
      </div>
    </div>

    <!-- Asignaciones -->
    <div class="tabla asignaciones">
      <h3>Asignaciones</h3>
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Trabajador</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(a, i) in asignaciones" :key="i">
            <td>#{{ a.pedido.id }} ({{ a.pedido.cantidad }} tacos)</td>
            <td>{{ a.trabajador }}</td>
            <td>{{ a.confirmado ? '✅ Confirmado' : '🕒 Pendiente' }}</td>
            <td>
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'

const pedidos = ref([
  { id: 1, cantidad: 100 },
  { id: 2, cantidad: 50 },
  { id: 3, cantidad: 200 },
  { id: 4, cantidad: 90 }
])

const trabajadores = ref(['Juan', 'Pedro', 'Ana', 'María'])

const asignaciones = ref([])
const seleccion = ref({ pedido: null, trabajador: null })
const animando = ref(false)

function girarRuleta() {
  animando.value = true
  setTimeout(() => {
    const pedido = pedidos.value[Math.floor(Math.random() * pedidos.value.length)]
    const trabajador = trabajadores.value[Math.floor(Math.random() * trabajadores.value.length)]
    seleccion.value = { pedido, trabajador }
    asignaciones.value.push({ pedido, trabajador, confirmado: false })
    animando.value = false
  }, 1500)
}

function confirmar(index) {
  Swal.fire({
    title: '¿Confirmar asignación?',
    text: `Asignar el pedido #${asignaciones.value[index].pedido.id} a ${asignaciones.value[index].trabajador}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#308a00',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      asignaciones.value[index].confirmado = true
      Swal.fire({
        title: '¡Confirmado!',
        text: 'La asignación ha sido registrada.',
        icon: 'success'
      })
    }
  })
}

function reasignar(index) {
  const nuevoTrabajador = trabajadores.value[Math.floor(Math.random() * trabajadores.value.length)]
  asignaciones.value[index].trabajador = nuevoTrabajador
}
</script>

<style scoped>
.asignador-container {
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  gap: 2rem;
  padding: 1.5rem;
}
.tablas-superiores {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.tabla {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1rem;
  width: 30%;
  background-color: #fdfdfd;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}
.ruleta {
  text-align: center;
}
.ruleta-circulo {
  width: 120px;
  height: 120px;
  margin: 1rem auto;
  border-radius: 50%;
  border: 6px solid #e91e63;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff0f6;
  transition: transform 1.4s ease;
}
.ruleta-circulo.girando {
  transform: rotate(1080deg);
}
.ruleta .emoji {
  font-size: 2.5rem;
}
.ruleta .resultado {
  margin-top: 1rem;
  font-weight: bold;
  color: #4caf50;
}

/* Botones globales */
.boton {
  padding: 10px 16px;
  margin: 5px 3px;
  font-weight: bold;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
  user-select: none;
  box-shadow: 0 0 6px #0002;
}

/* Estilo de botón Confirmar */
.confirmar {
  background-color: #4caf50;
  color: white;
}
.confirmar:hover {
  background-color: #388e3c;
  box-shadow: 0 0 10px #388e3ccc;
}

/* Estilo de botón Reasignar */
.secundario {
  background-color: #ff9800;
  color: white;
}
.secundario:hover {
  background-color: #e68900;
  box-shadow: 0 0 10px #ffb84d88;
}

/* Estilo botón Girar */
.girar {
  background-color: #2196f3;
  color: white;
}
.girar:hover {
  background-color: #1976d2;
  box-shadow: 0 0 10px #2196f388;
}

.asignaciones {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f0f7ff;
  border: 1px solid #aad;
  border-radius: 8px;
}
.asignaciones table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.asignaciones th,
.asignaciones td {
  border: 1px solid #aaa;
  padding: 0.6rem;
  text-align: center;
}
.asignaciones th {
  background-color: #cce3ff;
}
</style>