<template>
  <div class="app-container">
    <header>
      <h1>Chiquihuitl Sabores</h1>
      <div class="search-bar">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar..."
          aria-label="Buscar sabores"
        />
        <button @click.prevent="handleSearch">Buscar</button>
      </div>
    </header>

    <section class="card-grid">
      <div v-if="isLoading" class="status">Cargando sabores…</div>
      <div v-else-if="error" class="status error">{{ error }}</div>
      <div v-else-if="!filteredFoods.length" class="status">
        No se encontraron sabores.
      </div>

      <sabores
        v-else
        v-for="(item, index) in filteredFoods"
        :key="item.id"
        :food="item"
        :isHighlighted="index % 2 === 1"
        @add="handleAdd"
        @edit="handleEdit"
      />
    </section>
  </div>
</template>

<script>
import sabores from "../components/sabores.vue";
import { useCarritoStore } from "../stores/carrito";
import tacoPlaceholder from "../assets/img/taco.png";

export default {
  name: "ListarSabores",
  components: { sabores },
  data() {
    return {
      search: "",
      foods: [],
      isLoading: false,
      error: null,
    };
  },
  computed: {
    filteredFoods() {
      const term = this.search.trim().toLowerCase();
      if (!term) return this.foods;
      return this.foods.filter((f) => f.title.toLowerCase().includes(term));
    },
  },
  methods: {
    handleSearch() {
      // búsqueda reactiva
    },
    async fetchFoods() {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await fetch("/api/tacos");
        if (!res.ok) throw new Error("Error al cargar sabores");
        const data = await res.json();
        this.foods = data.map((item) => ({
          id: item.id,
          title: item.sabor,
          description: item.descripcion,
          image: item.imagen || tacoPlaceholder,
        }));
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
    handleAdd(food) {
      const carrito = useCarritoStore();
      carrito.agregarAlCarrito(food);
    },
    handleEdit(food) {
      this.$router.push(`/editar-taco/${food.id}`);
    },
  },
  mounted() {
    this.fetchFoods();
  },
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
  background: #f5f5f5;
}

header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
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
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  outline: none;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #81c81e;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 10px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.status {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
}

.status.error {
  color: #d33;
}

@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
