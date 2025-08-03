<!-- src/views/ComentariosView.vue -->
<template>
  <div class="comentarios-container">
    <h2>Comentarios para "{{ comentarios[0]?.local_nombre }}"</h2>

    <div class="nuevo-comentario">
      <input v-model="nuevo.texto" placeholder="Escribe tu comentario…" />
      <div class="estrellas">
        <span
          v-for="i in 5"
          :key="i"
          class="estrella"
          :class="{ activa: i <= nuevo.calificacion }"
          @click="nuevo.calificacion = i"
        >★</span>
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
          >★</span>
        </div>
        <button
          v-if="currentUser.role === 'admin' || c.usuario_id === currentUser.id"
          class="eliminar"
          @click="eliminarComentario(c.id)"
        >🗑</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComentariosView',
  props: {
    localId: { type: Number, required: true }
  },
  data() {
    return {
      nuevo: { texto: '', calificacion: 0 },
      comentarios: [],
      currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}')
    }
  },
  methods: {
    async fetchComentarios() {
      const res = await fetch(`/api/locales/${this.localId}/comentarios`)
      if (!res.ok) throw new Error('Error al cargar comentarios')
      this.comentarios = await res.json()
    },
    async agregarComentario() {
      if (!this.nuevo.texto.trim()) return alert('Escribe tu comentario.')
      const res = await fetch(
        `/api/locales/${this.localId}/comentarios`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.nuevo)
        }
      )
      if (!res.ok) throw new Error('Error al enviar comentario')
      this.comentarios.unshift(await res.json())
      this.nuevo.texto = ''
      this.nuevo.calificacion = 0
    },
    async eliminarComentario(id) {
      const res = await fetch(`/api/comentarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': this.currentUser.id,
          'X-User-Role': this.currentUser.role
        }
      })
      if (!res.ok) throw new Error('Error al eliminar')
      this.comentarios = this.comentarios.filter(c => c.id !== id)
    }
  },
  mounted() {
    this.fetchComentarios()
  }
}
</script>

<style scoped>
.comentarios-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
}
.nuevo-comentario { margin-bottom: 2rem; }
input {
  width: 100%;
  padding: 8px;
  margin: .5rem 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
button {
  padding: 8px 16px;
  background: #ffaa00;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: .5rem;
}
button:hover { background: #e69500; }
.estrellas {
  display: flex;
  gap: 4px;
  margin: .5rem 0;
}
.estrella {
  font-size: 24px;
  color: #ccc;
  cursor: pointer;
  transition: color .2s;
}
.estrella.activa { color: #f5a623; }
.lista-comentarios .comentario {
  margin-bottom: 1rem;
  padding: .5rem;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
  border-radius: 6px;
}
.eliminar {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #c00;
  margin-left: 8px;
}
.eliminar:hover { color: #900; }
</style>