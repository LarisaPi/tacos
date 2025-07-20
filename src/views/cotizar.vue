<template>
  <h1>Cotizar</h1>
  <h2 class="centrado">Bienvenido a Chiquihuitl Tacos</h2>

  <div class="linea-personas">
    <p>Cantidad de personas:</p>
    <button @click="decrementPersonas" class="contador">-</button>
    <input type="number" class="numero-input" v-model.number="personas" min="1" />
    <button @click="incrementPersonas" class="contador">+</button>
  </div>

  <div class="linea-personas">
    <p>Cantidad de orden:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
    <button @click="decrementOrden" class="contador">-</button>
    <input type="number" class="numero-input" v-model.number="orden" min="1" />
    <button @click="incrementOrden" class="contador">+</button>
  </div>

  <div class="linea-personas">
    <label class="label-sabor" for="Sabor">Selecciona sabores:</label>
    <div class="select-wrapper">
      <v-select
        :options="opciones"
        v-model="saboresSeleccionados"
        placeholder="Buscar y seleccionar sabores"
        multiple
        label="label"
      />
    </div>
  </div>

  <button class="button-cotizar">Cotizar</button>
  <h2 class="centrado">Total: ${{ total }}</h2>
</template>

<script setup>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { ref, computed, watch } from 'vue'

const personas = ref(1)
const orden = ref(1)

const incrementPersonas = () => {
  personas.value++
}
const decrementPersonas = () => {
  if (personas.value > 1) personas.value--
}
const incrementOrden = () => {
  orden.value++
}
const decrementOrden = () => {
  if (orden.value > 1) orden.value--
}

const opciones = [
  { label: 'Frijol', precio: 8 },
  { label: 'Chicharrón', precio: 12 },
  { label: 'Papa', precio: 7 },
  { label: 'Garbanzo', precio: 9 },
  { label: 'Queso', precio: 10 },
  { label: 'Carnitas', precio: 15 },
  { label: 'Aguacate', precio: 13 },
]

const saboresSeleccionados = ref([])

const total = computed(() => {
  let subtotalPorOrden = saboresSeleccionados.value.reduce((sum, sabor) => sum + sabor.precio, 0)
  return personas.value * orden.value * subtotalPorOrden
})

watch(personas, (newVal) => {
  if (newVal < 1) personas.value = 1
})
watch(orden, (newVal) => {
  if (newVal < 1) orden.value = 1
})
</script>

<style>
.centrado {
  text-align: center;
  margin: 20px auto;
  font-family: 'Roboto', sans-serif;
}
.numero-input {
  width: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border: 1px solid #ffffff;
}
label {
  font-family: 'Roboto', sans-serif;
  padding-left: 200px;
  text-align: left;
  font-size: 30px;
  margin-top: 25px;
  padding-bottom: 25px;
}
.select-wrapper {
  font-family: 'Roboto', sans-serif;
  flex: 0 0 300px;
  max-width: 300px;
}
.linea-personas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 24px;
  margin-top: 25px;
  padding-right: 200px;
}
.numero {
  font-family: 'Roboto', sans-serif;
  width: 40px;
  text-align: center;
  font-weight: bold;
  color: black;
}
.contador {
  font-size: 18px;
  padding: 5px 10px;
  background-color: #D2782A;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 0;
}
.button-cotizar {
  font-family: 'Roboto', sans-serif;
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #D2782A;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
p {
  font-family: 'Roboto', sans-serif;
  padding-left: 200px;
  text-align: left;
  font-size: 30px;
  margin-top: 25px;
}
h2 {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  margin-top: 20px;
  font-size: 25px;
}
h1 {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  margin-top: 20px;
  font-size: 35px;
  font-weight: bold;
}
</style>