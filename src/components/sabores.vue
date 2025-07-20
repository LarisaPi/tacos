<template>
  <div class="food-card" :class="{ orange: isHighlighted, yellow: !isHighlighted }">
    <img :src="food.image" alt="Comida" />
    <h3>{{ food.title }}</h3>
    <p>{{ food.description }}</p>
    <div class="buttons">
      <button @click.stop="handleAdd">Agregar</button>
      <button @click.stop="handleEdit">Editar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "sabores",
  props: {
    food: Object,
    isHighlighted: Boolean,
  },
  methods: {
    handleAdd() {
      this.$emit("add", this.food);
    },
    handleEdit() {
      this.$emit("edit", this.food);
    },
  },
};
</script>

<style scoped>
.food-card {
  padding: 18px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  font-size: 14px;
  background-color: white;
  min-height: 500px; /* estilo espejo largo */
  height: 100%;
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
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.food-card h3 {
  margin: 10px 0 6px;
  text-align: center;
  font-size: 16px;
}

.food-card p {
  flex-grow: 1;
  text-align: center;
  font-size: 14px;
  margin: 0;
  padding: 0 5px;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.buttons button {
  background-color: #bc8912;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  flex: 1;
  margin: 0 4px;
  font-size: 13px;
}

.buttons button:hover {
  background-color: #005f73;
}
</style>
