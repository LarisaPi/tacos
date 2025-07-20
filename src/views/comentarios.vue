<template>
  <div class="comentarios-container">
    <h2>Comentarios</h2>

    <div class="nuevo-comentario">
      <label for="comentario">Agregar comentario:</label>
      <input
        id="comentario"
        v-model="nuevoComentario.texto"
        placeholder="Escribe tu comentario..."
      />

      <div class="estrellas">
        <span
          v-for="i in 5"
          :key="i"
          class="estrella"
          :class="{ activa: i <= nuevoComentario.calificacion }"
          @click="nuevoComentario.calificacion = i"
        >★</span>
      </div>

      <button @click="agregarComentario">Agregar comentario</button>
    </div>

    <div class="lista-comentarios">
      <div
        v-for="(comentario, index) in comentarios"
        :key="index"
        class="comentario"
      >
        <div class="comentario-header">
          <p>{{ comentario.texto }}</p>
          <button class="eliminar" @click="eliminarComentario(index)">🗑</button>
        </div>

        <!-- Estrellas interactivas por cada comentario -->
        <div class="estrellas">
          <span
            v-for="i in 5"
            :key="i"
            class="estrella"
            :class="{ activa: i <= comentario.calificacionInteractiva }"
            @click="calificarComentario(index, i)"
          >★</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comentarios',
  data() {
    return {
      nuevoComentario: {
        texto: '',
        calificacion: 0,
      },
      comentarios: [
        {
          texto: 'Excelente producto, llegó a tiempo y funciona perfectamente.',
          calificacion: 5,
          calificacionInteractiva: 5,
        },
        {
          texto: 'No era lo que esperaba, pero el soporte fue muy amable.',
          calificacion: 3,
          calificacionInteractiva: 3,
        },
        {
          texto: 'Me encantó el diseño y la calidad. Lo recomiendo totalmente.',
          calificacion: 4,
          calificacionInteractiva: 4,
        },
      ],
    };
  },
  methods: {
    agregarComentario() {
      if (this.nuevoComentario.texto.trim()) {
        this.comentarios.push({
          texto: this.nuevoComentario.texto,
          calificacion: this.nuevoComentario.calificacion,
          calificacionInteractiva: this.nuevoComentario.calificacion,
        });
        this.nuevoComentario.texto = '';
        this.nuevoComentario.calificacion = 0;
      } else {
        alert('Por favor escribe un comentario.');
      }
    },
    eliminarComentario(index) {
      this.comentarios.splice(index, 1);
    },
    calificarComentario(index, nuevaCalificacion) {
      this.comentarios[index].calificacionInteractiva = nuevaCalificacion;
    },
  },
};
</script>

<style scoped>
.comentarios-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: 'Arial', sans-serif;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.nuevo-comentario {
  margin-bottom: 2rem;
}

input {
  width: 100%;
  padding: 8px;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  background-color: #ffaa00;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
}

button:hover {
  background-color: #e69500;
}

.estrellas {
  display: flex;
  gap: 4px;
  margin: 0.5rem 0;
}

.estrella {
  font-size: 24px;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s ease;
}

.estrella.activa {
  color: #f5a623;
}

.lista-comentarios .comentario {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.comentario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comentario p {
  margin: 0 0 0.5rem 0;
  font-size: 15px;
}

.eliminar {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #c00;
  margin-left: 8px;
}

.eliminar:hover {
  color: #900;
}
</style>
