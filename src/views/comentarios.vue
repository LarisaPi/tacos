<template>
  <div class="comentarios-container">
    <h2>Comentarios del local #{{ localId }}</h2>

    <div class="nuevo-comentario">
      <input v-model="nuevo.texto" placeholder="Escribe tu comentario..." />
      <div class="estrellas">
        <span
          v-for="i in 5"
          :key="i"
          class="estrella"
          :class="{ activa: i <= nuevo.calificacion }"
          @click="nuevo.calificacion = i"
          >★</span
        >
      </div>
      <button @click="agregarComentario">Agregar comentario</button>
    </div>

    <div class="lista-comentarios">
      <div v-for="c in comentarios" :key="c.id" class="comentario">
        <p>{{ c.texto }}</p>
        <div class="estrellas">
          <span
            v-for="i in 5"
            :key="i"
            class="estrella"
            :class="{ activa: i <= c.calificacion }"
            >★</span
          >
        </div>
        <button class="eliminar" @click="eliminarComentario(c.id)">🗑</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComentariosView",
  props: { localId: { type: Number, required: true } },
  data() {
    return {
      nuevo: { texto: "", calificacion: 0 },
      comentarios: [],
    };
  },
  methods: {
    fetchComentarios() {
      fetch(`/api/locales/${this.localId}/comentarios`)
        .then((r) => r.json())
        .then((data) => (this.comentarios = data))
        .catch(console.error);
    },
    agregarComentario() {
      if (!this.nuevo.texto.trim()) return alert("Escribe tu comentario.");
      fetch(`/api/locales/${this.localId}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.nuevo),
      })
        .then((r) => r.json())
        .then((nc) => {
          this.comentarios.unshift(nc);
          this.nuevo.texto = "";
          this.nuevo.calificacion = 0;
        })
        .catch(console.error);
    },
    eliminarComentario(id) {
      fetch(`/api/comentarios/${id}`, { method: "DELETE" })
        .then(() => {
          this.comentarios = this.comentarios.filter((c) => c.id !== id);
        })
        .catch(console.error);
    },
  },
  mounted() {
    this.fetchComentarios();
  },
};
</script>

<style scoped>
.comentarios-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: "Arial", sans-serif;
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
