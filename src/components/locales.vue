<template>
  <div class="local-card" :class="{ orange: isHighlighted, yellow: !isHighlighted }">
    <img :src="local.image" alt="Local" />
    <h3>{{ local.title }}</h3>
    <p>{{ local.description }}</p>

    <div class="card-footer-image">
      <img
        src="https://via.placeholder.com/150x80.png?text=Footer+Test"
        alt="Footer Test"
      />
    </div>

    <div class="card-buttons">
      <button class="edit-btn" @click="onEdit">Editar</button>
      <!-- Botón Eliminar eliminado -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  local: Object,
  isHighlighted: Boolean,
});

const router = useRouter();

function onEdit() {
  router.push({ path: "/editar_local", query: { id: props.local.id } });
}
</script>

<style scoped>
.local-card {
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  font-size: 14px;
  background-color: white;
}

.local-card.yellow {
  background-color: #fff59d;
}
.local-card.orange {
  background-color: #ffb74d;
}

.local-card:hover {
  transform: scale(1.03);
}

.local-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.local-card h3 {
  margin: 8px 0 4px;
  text-align: center;
  font-size: 16px;
}

.local-card p {
  text-align: center;
  font-size: 13px;
}

.card-footer-image img {
  margin-top: 15px;
  width: 100%;
  border-radius: 8px;
}

.card-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
}

.card-buttons button {
  flex: 1;
  height: 45px;
  padding: 6px 8px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
}
.edit-btn:hover {
  background-color: #388e3c;
}

/* delete-btn ya no se usa */
</style>
