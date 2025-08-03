<template>
  <div class="food-card"
       :class="{ orange: isHighlighted, yellow: !isHighlighted }">
    <img :src="food.image || placeholderImage" alt="Comida" />
    <h3><em>{{ food.title }}</em></h3>

    <div class="desc-container">
      <p class="desc">{{ food.description }}</p>
    </div>

    <div class="qty-section">
      <strong>Cantidad:</strong>
      <div class="qty-control">
        <button @click="decreaseQty">−</button>

        <input
          type="number"
          v-model.number="editableQty"
          @change="validateQty"
          min="50"
        />

        <button @click="increaseQty">+</button>
      </div>
    </div>

    <div class="buttons-center">
      <button class="delete-button" @click="$emit('remove', index)">
        Eliminar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodCard',
  props: {
    food: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isHighlighted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      placeholderImage: 'https://via.placeholder.com/400x150.png?text=Comida',
      editableQty: 50   // siempre arranca en 50
    }
  },
  mounted() {
    this.syncQtyFromProp()
  },
  watch: {
    // Observamos todo el objeto food
    food: {
      handler() {
        this.syncQtyFromProp()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    syncQtyFromProp() {
      // if no qty or <50, forzamos 50
      const parsed = parseInt(this.food.qty, 10)
      this.editableQty = (!isNaN(parsed) && parsed >= 50) ? parsed : 50
      // opcional: emitir de nuevo para corregir store al cargar
      this.$emit('update-qty', this.index, this.editableQty)
    },
    increaseQty() {
      this.editableQty++
      this.$emit('update-qty', this.index, this.editableQty)
    },
    decreaseQty() {
      this.editableQty = Math.max(50, this.editableQty - 1)
      this.$emit('update-qty', this.index, this.editableQty)
    },
    validateQty() {
      let parsed = parseInt(this.editableQty, 10)
      if (isNaN(parsed) || parsed < 50) parsed = 50

      this.editableQty = parsed
      this.$emit('update-qty', this.index, parsed)
    }
  }
}
</script>

<style scoped>
.food-card {
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
  box-sizing: border-box;
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
  text-align: left;
  font-weight: bold;
}

.desc-container {
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}

.desc {
  font-size: 0.85rem;
  font-style: italic;
  color: #333;
  width: 100%;
  white-space: pre-line;
  margin: 0;
  padding: 0;
  text-align: left;
}

.qty-section {
  margin-top: 10px;
  text-align: left;
  width: 100%;
}

.qty-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: white;
  border-radius: 10px;
  padding: 5px 15px;
  margin-top: 5px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.qty-control button {
  background-color: #5c67f2;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.qty-control input {
  width: 50px;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px;
}

.buttons-center {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.delete-button {
  background-color: #c62828;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.delete-button:hover {
  background-color: #8e0000;
}
</style>
