<template>
  <div>
    <h1>Estado de tus pedidos</h1>

    <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-bloque">
      <!-- Nombre del cliente -->
      <h2>Cliente: {{ pedido.nombre_cliente }}</h2>

      <!-- barra de progreso -->
      <div class="progress-container">
        <div class="progress-steps">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step"
            :class="{
              active:
                i <=
                (pedido.estado_id === 5
                  ? pedido.estado_id_original - 1
                  : pedido.estado_id - 1),
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
                '%',
            }"
          ></div>
        </div>
      </div>

      <!-- estado visual -->
      <p><strong>Estado:</strong> {{ mostrarEstado(pedido) }}</p>

      <!-- botones de acción -->
      <div class="buttons-row">
        <button
          class="cancel-btn"
          @click="cancelarPedido(pedido)"
          :disabled="pedido.estado_id >= 4"
        >
          Cancelar pedido
        </button>
        <button
          @click="confirmarEstado(pedido)"
          :disabled="pedido.estado_id >= steps.length"
        >
          Siguiente estado
        </button>
      </div>

      <!-- detalles del pedido -->
      <h3>Información del pedido</h3>
      <p>
        <strong>Cantidad total:</strong>
        {{
          pedido.sabores?.reduce((acc, sabor) => acc + (sabor.cantidad || 0), 0) ?? "N/A"
        }}
      </p>
      <p>
        <strong>Dirección:</strong>
        {{ pedido.direccion_calle }}, {{ pedido.direccion_colonia }},
        {{ pedido.direccion_ciudad }}, CP {{ pedido.direccion_cp }}
      </p>
      <p><strong>Teléfono:</strong> {{ pedido.telefono }}</p>
      <p>
        <strong>Fecha:</strong>
        {{ new Date(pedido.fecha).toLocaleString("es-MX") }}
      </p>
      <p><strong>Total:</strong> ${{ (pedido.total ?? 0).toFixed(2) }}</p>

      <!-- sabores -->
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
import Swal from "sweetalert2";

export default {
  data() {
    return {
      steps: ["Recibido", "En Preparación", "En camino", "Entregado"],
      pedidos: [],
    };
  },
  methods: {
    async obtenerPedidos() {
      try {
        const userId = 3; // ajusta según tu cliente
        const res = await fetch(`http://localhost:3000/api/pedidos/usuario/${userId}`);
        if (!res.ok) throw new Error("Fetch error");
        const pedidos = await res.json();

        // traer sabores de cada pedido
        await Promise.all(
          pedidos.map(async (pedido) => {
            const rs = await fetch(
              `http://localhost:3000/api/pedidos/${pedido.id}/sabores`
            );
            pedido.sabores = rs.ok ? await rs.json() : [];
          })
        );

        this.pedidos = pedidos;
      } catch (err) {
        console.error("Error al obtener pedidos o sabores:", err);
      }
    },
    async confirmarEstado(pedido) {
      const siguiente = pedido.estado_id + 1;
      if (siguiente > this.steps.length) return;

      const { isConfirmed } = await Swal.fire({
        title: "¿Avanzar al siguiente estado?",
        text: `"${this.steps[siguiente - 1]}"`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, avanzar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "green",
        cancelButtonColor: "red",
      });
      if (!isConfirmed) return;

      try {
        const res = await fetch(`http://localhost:3000/api/pedidos/${pedido.id}/estado`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado_id: siguiente }),
        });
        if (!res.ok) throw new Error();
        pedido.estado_id = siguiente;
        Swal.fire("¡Estado actualizado!", "", "success");
      } catch (err) {
        console.error("Error actualizando estado:", err);
        Swal.fire("Error", "No pudimos actualizar.", "error");
      }
    },
    async cancelarPedido(pedido) {
      const { isConfirmed } = await Swal.fire({
        title: "¿Cancelar este pedido?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
        confirmButtonColor: "red",
      });

      if (!isConfirmed) return;

      try {
        // Guardamos el estado actual antes de cancelar
        pedido.estado_id_original = pedido.estado_id;

        const res = await fetch(`http://localhost:3000/api/pedidos/${pedido.id}/estado`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado_id: 5 }), // ← Estado cancelado
        });

        if (!res.ok) throw new Error();

        pedido.estado_id = 5; // ← Reflejamos el cambio localmente
        Swal.fire("Cancelado", "El pedido ha sido cancelado.", "success");
      } catch (err) {
        console.error("Error cancelando pedido:", err);
        Swal.fire("Error", "No pudimos cancelar el pedido.", "error");
      }
    },
    mostrarEstado(pedido) {
      const estados = [
        "Recibido",
        "En Preparación",
        "En camino",
        "Entregado",
        "Cancelado",
      ];
      const original =
        pedido.estado_id === 5 ? pedido.estado_id_original || 1 : pedido.estado_id;
      const textoEstado = estados[original - 1];

      return pedido.estado_id === 5
        ? `Cancelado (estaba en ${textoEstado})`
        : textoEstado;
    },
  },
  mounted() {
    this.obtenerPedidos();
  },
};
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
  font-family: "roboto", sans-serif;
  background-color: #d33;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button {
  font-family: "roboto", sans-serif;
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
  font-family: "roboto", sans-serif;
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
  content: "";
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
  font-family: "roboto", sans-serif;
  margin-bottom: 1rem;
}
.pedido-bloque ul li {
  margin-bottom: 0.5rem;
}
</style>
