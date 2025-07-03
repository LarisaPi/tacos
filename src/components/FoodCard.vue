<template>
    <div class="card-grid">
  <div class="food-card" :class="{ orange: isHighlighted, yellow: !isHighlighted }">
    <img :src="food.image" alt="Comida" />
    <h3>{{ food.title }}</h3>
    <p>{{ food.description }}</p>
    <div class="buttons">
      <button @click.stop="handleAdd">Agregar</button>
      <button @click.stop="handleEdit">Editar</button>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'FoodCard',
  props: {
    food: Object,
    isHighlighted: Boolean
  },
  methods: {
    handleAdd() {
      this.$emit('add', this.food)
    },
    handleEdit() {
      this.$emit('edit', this.food)
    }
  }
}
</script>

<style scoped>
.food-card {
  padding: 25px;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
}

.food-card.yellow {
  background-color: #fff59d;
}

.food-card.orange {
  background-color: #ffb74d;
}

.food-card:hover {
  transform: scale(1.03);
}

.food-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

.food-card h3 {
  margin: 10px 0 5px;
  text-align: center;
}

.food-card p {
  flex-grow: 1;
  text-align: center;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.buttons button {
  background-color: #bc8912;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  flex: 1;
  margin: 0 5px;
}

.buttons button:hover {
  background-color: #005f73;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* ← 5 columnas */
  gap: 30px;
  align-items: stretch; /* ← fuerza igual altura */
}

</style>
