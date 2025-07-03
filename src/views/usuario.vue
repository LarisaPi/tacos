<template>
  <div class="app-container">
    <header>
      <h1>Usuarios</h1>
      <div class="search-bar">
        <input v-model="search" placeholder="Buscar usuario..." />
        <button>Buscar</button>
      </div>
    </header>

    <div class="card-grid">
      <div
        v-for="(usuario, index) in filteredUsers"
        :key="index"
        :class="['usuario-card', index % 2 === 0 ? 'orange' : 'yellow']"
      >
        <div class="user-avatar">👤</div>
        <p><strong>{{ usuario.nombre }}</strong></p>
        <p>{{ usuario.email }}</p>
        <p>{{ usuario.telefono }}</p>
        <p>{{ usuario.ubicacion }}</p>
        <p>{{ usuario.rol }}</p>
        <button class="editar-btn" @click="handleEdit(usuario)">Editar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      usuarios: [
        { nombre: 'Juan', email: 'juan@perez', telefono: '23045996', ubicacion: 'Tlaxcala', rol: 'Vendedor' },
        { nombre: 'Ana', email: 'ana@gmail.com', telefono: '23123456', ubicacion: 'Apizaco', rol: 'Administrador' },
        { nombre: 'Luis', email: 'luis@hotmail.com', telefono: '22114566', ubicacion: 'Huamantla', rol: 'Cliente' },
        { nombre: 'María', email: 'maria@live.com', telefono: '22118976', ubicacion: 'Chiautempan', rol: 'Vendedor' },
        { nombre: 'Pedro', email: 'pedro@yahoo.com', telefono: '22119876', ubicacion: 'Zacatelco', rol: 'Administrador' },
        { nombre: 'Sofía', email: 'sofia@mail.com', telefono: '22112345', ubicacion: 'Tlaxco', rol: 'Cliente' },
        { nombre: 'Carlos', email: 'carlos@correo.com', telefono: '22116789', ubicacion: 'Teolocholco', rol: 'Vendedor' },
        { nombre: 'Laura', email: 'laura@empresa.com', telefono: '22119987', ubicacion: 'Panotla', rol: 'Administrador' }
      ]
    };
  },
  computed: {
    filteredUsers() {
      return this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    handleEdit(usuario) {
      console.log('Editar usuario:', usuario);
      alert(`Editar a ${usuario.nombre}`);
    }
  }
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
}

header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 5px 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  flex-grow: 1;
  max-width: 400px;
}

.search-bar input {
  padding: 10px;
  border-radius: 10px;
  border: none;
  width: 100%;
  outline: none;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #81c81e;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  white-space: nowrap;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 25px;
}

.usuario-card {
  padding: 15px;
  border-radius: 10px;
  color: black;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  background-color: white;
}

.usuario-card:hover {
  transform: scale(1.02);
}

.orange {
  background-color: #ffa655;
}

.yellow {
  background-color: #ffe833;
}

.user-avatar {
  font-size: 36px;
  margin-bottom: 10px;
}

.editar-btn {
  background-color: #a44e00;
  color: white;
  border: none;
  padding: 6px 12px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

/* Responsivo para tablets */
@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Responsivo para móviles grandes */
@media (max-width: 600px) {
  header {
    justify-content: center;
  }

  .search-bar {
    max-width: 100%;
  }

  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Responsivo para móviles pequeños */
@media (max-width: 400px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .search-bar button {
    padding: 10px;
    margin-left: 5px;
    font-size: 14px;
  }
}
</style>
