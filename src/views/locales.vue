<template>
  <div class="app-container">
    <header>
      <h1>Locales</h1>
      <div class="search-bar">
        <input v-model="search" placeholder="Buscar..." />
        <button @click="searchLocales">Buscar</button>
      </div>
    </header>

    <div class="card-grid">
      <Locales
        v-for="(item, index) in filteredLocales"
        :key="index"
        :local="item"
        :isHighlighted="index % 2 === 1"
      />
    </div>
  </div>
</template>

<script>
import Locales from "../components/locales.vue";

export default {
  name: "LocalesView",
  components: {
    Locales,
  },
  data() {
    return {
      search: "",
      locales: [
        {
          title: "Taco papa con pistache",
          image: "../assets/img/tacostlaxcala.png",
          description:
            "Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar",
        },
        {
          title: "Taco de carnitas",
          image: "https://example.com/taco.jpg",
          description:
            "Carnitas tradicionales servidas en tortilla de maíz con salsa y cebolla.",
        },
        {
          title: "Taco árabe",
          image: "https://example.com/taco2.jpg",
          description: "Estilo Puebla, carne marinada en pan pita.",
        },
        {
          title: "Taco de barbacoa",
          image: "https://example.com/taco3.jpg",
          description: "Cocido al horno en pencas de maguey.",
        },
        {
          title: "Taco de asada",
          image: "https://example.com/taco4.jpg",
          description: "Con carne asada, cebolla, y guacamole.",
        },
        {
          title: "Taco de birria",
          image: "https://example.com/taco5.jpg",
          description: "Deliciosa birria jugosa en tortilla dorada.",
        },
      ],
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
      // Funcionalidad opcional
    },
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
  background: white;
  border-radius: 10px;
  padding: 3px 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  height: 38px; /* Compacto y alineado */
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
  color: white;
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
