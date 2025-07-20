<template>
  <div class="usuarios">
    <header class="encabezado">
      <h1>Usuarios</h1>
      <div class="busqueda">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre o correo"
          aria-label="Buscar"
        />
        <button @click.prevent="buscar">Buscar</button>
      </div>
    </header>

    <section class="tarjetas">
      <div
        v-for="(usuario, index) in usuariosFiltrados"
        :key="usuario.id"
        class="tarjeta"
        :class="index % 2 === 0 ? 'naranja' : 'amarilla'"
      >
        <div class="imagen-container">
          <img
            v-if="usuario.foto"
            :src="usuario.foto"
            alt="Foto perfil"
            class="foto"
            @error="usuario.foto = ''"
          />
          <div v-else class="icono-default">👤</div>
        </div>

        <div class="contenido">
          <h3>{{ usuario.nombre }}</h3>
          <p>{{ usuario.email }}</p>
          <p>{{ usuario.telefono }}</p>
          <p>{{ usuario.ubicacion }}</p>
          <p>{{ usuario.rol }}</p>
        </div>

        <div class="boton-container">
         <button @click="editar(usuario.id)">Editar</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Edit_usuario from './edit_usuario.vue';

export default {
  data() {
    return {
      search: "",
      usuarios: [],
      usuariosFiltrados: [],
    };
  },
  methods: {
    async cargarUsuarios() {
      try {
        const res = await fetch("http://localhost:3000/api/usuarios");
        const data = await res.json();
        console.log("Datos recibidos backend:", data);
        this.usuarios = data.map((u) => ({
          id: u.id,
          nombre: u.nombre,
          email: u.correo_electronico,
          telefono: u.contacto,
          ubicacion: u.ciudad,
          rol: u.tipo_usuario,
          foto: u.foto_perfil,
        }));
        console.log("Usuarios mapeados:", this.usuarios);
        this.usuariosFiltrados = this.usuarios; // Mostrar todos al cargar
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    },
    buscar() {
      const texto = this.search.toLowerCase();
      this.usuariosFiltrados = this.usuarios.filter(
        (u) =>
          u.nombre.toLowerCase().includes(texto) ||
          u.email.toLowerCase().includes(texto)
      );
    },
    editar(id) {
      this.$router.push({ name: 'EditUsuario', params: { id } });
    }

  },
  mounted() {
    this.cargarUsuarios();
  },
};
</script>

<style scoped>
/* Copia tu CSS aquí igual que antes */
.usuarios {
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.encabezado {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.busqueda {
  display: flex;
  background: white;
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.busqueda input {
  flex-grow: 1;
  border: none;
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  outline: none;
}

.busqueda button {
  background: #81c81e;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  margin-left: 8px;
  font-size: 14px;
  cursor: pointer;
}

.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tarjeta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}

.tarjeta:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.imagen-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.foto {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.icono-default {
  font-size: 80px;
  color: #555;
  text-align: center;
}

.contenido {
  margin-top: 10px;
  max-width: 90%;
}

.contenido h3 {
  margin: 6px 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.contenido p {
  margin: 4px 0;
  line-height: 1.4;
  font-size: 0.95rem;
  text-align: left;
  word-break: normal;
  overflow-wrap: anywhere; /* Se parte solo si es necesario */
  white-space: normal;
  padding-left: 10px;
}


.boton-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  width: 100%;
}

.boton-container button {
  flex: 1;
  background: #a44e00;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.boton-container button:hover {
  background: #7c3e00;
}

.naranja {
  background: #ffb97a;
}

.amarilla {
  background: #fff386;
}

@media (max-width: 1024px) {
  .tarjetas {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .tarjetas {
    grid-template-columns: 1fr;
  }
}
</style>
