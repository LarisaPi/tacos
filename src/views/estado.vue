<template>
  <div>
    <h1>Estado de pedido</h1>

    <div class="progress-container">
      <div class="progress-steps">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step"
          :class="{ active: index <= currentStep }"
        >
          {{ step }}
        </div>
        <div class="progress-bar-background"></div>
        <div
          class="progress-bar"
          :style="{ width: (currentStep / (steps.length - 1)) * 100 + '%' }"
        ></div>
      </div>
    </div>

    <button
      @click="confirmar"
      id="btn-estado"
      :disabled="currentStep >= steps.length - 1"
    >
      Siguiente estado
    </button>
  </div>

  <div>
    <h3>Informacion del pedido</h3>
    <span>Tacos de canasta de papa: 50</span> <br>
<span>Tacos de canasta de papa: 60 </span> <br>
<span>Tacos de canasta de papa: 40</span> <br>
<span>A la dirección:</span> <br>
<span>Calle:   MORELOS NO. 607 NO. A, CENTRO, 36700</span> <br>
<span>Ciudad:    Guanajuato</span> <br>
<span>Estado/provincia/zona:    Salamanca</span> <br>
<span>Número de teléfono:   464.647-7678</span> <br>
<span>Código postal:   36700</span> <br>
<span>Código de llamada del país:   +52 123-456-78-90</span> <br>
<span>País:   México</span>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      currentStep: 0,
      steps: ['Recibido', 'En Preparación', 'En camino', 'Entregado']
    };
  },
  methods: {
    confirmar() {
      if (this.currentStep >= this.steps.length - 1) return;

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas pasar al siguiente estado del pedido? Esta acción no se puede deshacer.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.currentStep++;
        }
      });
    }
  }
};
</script>

<style scoped>
.text{
  font-family: 'roboto', sans-serif;;
}

span{
  font-family: 'roboto', sans-serif;
  padding-left: 50px;
}

h3{
  padding-left: 50px;
}

button {
  font-family: 'roboto', sans-serif;
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.progress-container {
  width: 100%;
  margin: 40px auto;
  padding: 0 20px;
}

.progress-steps {
  font-family: 'roboto', sans-serif;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.step {
  font-family: 'roboto', sans-serif;
  position: relative;
  text-align: center;
  width: 25%;
  color: gray;
  z-index: 2;
}

.step::before {
  font-family: 'roboto', sans-serif;
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid gray;
  border-radius: 50%;
  background-color: white;
  margin: 0 auto 5px auto;
  z-index: 2;
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
}

.progress-bar {
  position: absolute;
  top: 10px;
  left: 0;
  height: 6px;
  width: 0%;
  background-color: green;
  transition: width 0.5s;
  z-index: 2;
}
</style>
