<template>
  <div class="app-container">
    <header>
      <h1>Locales</h1>
      <div class="search-bar">
        <input v-model="search" placeholder="Buscar..." />
        <button @click="searchLocales">Buscar</button>
        <router-link to="/registrar_local">
          <button>Registrar Nuevo</button>
        </router-link>
      </div>
    </header>

    <div class="card-grid">
      <Locales
        v-for="(item, index) in filteredLocales"
        :key="item.id"
        :local="item"
        :isHighlighted="index % 2 === 1"
      />
    </div>
  </div>
</template>

<script>
import Locales from "../components/Locales.vue";

export default {
  name: "LocalesView",
  components: { Locales },
  data() {
    return {
      search: "",
      locales: [],
    };
  },
  computed: {
    filteredLocales() {
      return this.locales.filter((local) =>
        local.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    searchLocales() {
      // Si en el futuro quieres buscar en el backend, haz la petición aquí
    },
    fetchLocales() {
      fetch("/api/locales")
        .then((res) => res.json())
        .then((data) => {
          this.locales = data.map((item) => ({
            id: item.id,
            title: item.nombre_local,
            description: item.descripcion,
            street: item.calle,
            neighborhood: item.colonia,
            city: item.ciudad,
            state: item.estado,
            zip: item.codigo_postal,
            fotoLocal: item.foto_local,
            imagenUbicacion: item.imagen_ubicacion,
          }));
        })
        .catch((err) => console.error("Error al cargar locales:", err));
    },
  },
  mounted() {
    this.fetchLocales();
  },
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 3px 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  height: 38px;
}

.search-bar input {
  padding: 6px 10px;
  border-radius: 10px;
  border: none;
  width: 250px;
  font-size: 14px;
  outline: none;
}

.search-bar button {
  padding: 6px 15px;
  background-color: #00aaff;
  color: #fff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  align-items: stretch;
}
</style>
