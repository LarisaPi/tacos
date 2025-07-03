<template>
  <div class="app-container">
    <header>
      <h1>Chiquihuitl Sabor</h1>
      <div class="search-bar">
        <input v-model="search" placeholder="Buscar..." />
        <button>Buscar</button>
      </div>
    </header>

    <div class="card-grid">
      <FoodCard
        v-for="(item, index) in filteredFoods"
        :key="index"
        :food="item"
        :isHighlighted="index % 2 === 1"
        @add="handleAdd"
      />
    </div>
  </div>
</template>

<script>
import FoodCard from '../components/FoodCard.vue'

export default {
  components: {
    FoodCard
  },
  data() {
    return {
      search: '',
      foods: [
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacostlaxcala.png', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        },
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacospapa.jpg', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        },
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacosalsa.jpg', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        },
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacosalsa.jpg', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        },
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacosalsa.jpg', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        },
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacostlaxcala.png', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        },
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacostlaxcala.png', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        },
        {
          title: 'Taco papa con pistache',
          image: new URL('../assets/img/tacostlaxcala.png', import.meta.url).href,
          description: 'Tortillas de maíz, papas (sobras), frías. Salsa verde o roja, para acompañar'
        }
      ]
    }
  },
  computed: {
    filteredFoods() {
      return this.foods.filter(food =>
        food.title.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  methods: {
    handleAdd(food) {
      this.$router.push({ path: '/carrito', query: { producto: JSON.stringify(food) } })
    }
  }
}
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
  column-gap: 15px;
  row-gap: 25px;
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
