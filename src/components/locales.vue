<template>
  <div
    class="local-card"
    :class="{ orange: isHighlighted, yellow: !isHighlighted }"
  >
    <img
      :src="fotoLocalSrc"
      alt="Foto del local"
      class="local-img"
    />

    <h3>{{ local.title }}</h3>

    <p class="local-address">
      {{ local.street }}, {{ local.neighborhood }}, {{ local.city }},
      {{ local.state }} – CP {{ local.zip }}
    </p>

    <p class="local-description">{{ local.description }}</p>

    <img
      v-if="ubicacionSrc"
      :src="ubicacionSrc"
      alt="Ubicación"
      class="local-img ubicacion"
    />

    <div class="buttons">
      <!-- Solo usuarios con rol válido ven el botón de Editar -->
      <router-link
        v-if="rolValido"
        :to="`/editar-local/${local.id}`"
      >
        <button>Editar</button>
      </router-link>

      <!-- Comentarios siempre visible -->
      <router-link
        :to="`/locales/${local.id}/comentarios`"
      >
        <button>Comentarios</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import imgFallback from "../assets/img/repartocansta.png";

export default {
  name: "Locales",
  props: {
    local: { type: Object, required: true },
    isHighlighted: { type: Boolean, default: false },
  },
  computed: {
    fotoLocalSrc() {
      const b64 = this.local.fotoLocal;
      if (!b64) return imgFallback;
      return b64.startsWith("data:image")
        ? b64
        : `data:image/jpeg;base64,${b64}`;
    },
    ubicacionSrc() {
      const b64 = this.local.imagenUbicacion;
      if (!b64) return null;
      return b64.startsWith("data:image")
        ? b64
        : `data:image/jpeg;base64,${b64}`;
    },
    rolValido() {
      const rol = this.$route.params.rol;
      return ["admin", "vendedor"].includes(rol);
    },
  },
};
</script>

<style scoped>
.local-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.local-card.orange {
  background: #fff8e1;
}

.local-card.yellow {
  background: #e3f2fd;
}

.local-img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
}

.ubicacion {
  margin-top: 8px;
}

.local-address {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin: 8px 0;
}

.local-description {
  font-size: 0.85rem;
  color: #555;
  text-align: center;
  margin-bottom: 12px;
}

.buttons {
  margin-top: auto;
}

.buttons a {
  text-decoration: none; /* Quita subrayado del link */
}

.buttons button {
  padding: 6px 12px;
  background-color: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none; /* Por si acaso */
}

.buttons button:hover {
  background-color: #1565c0;
}
</style>

<style scoped>
.local-card {
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
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

/* Imágenes sin fondo blanco */
.local-img {
  width: 60%;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: transparent;
}

/* Título */
.local-card h3 {
  margin: 8px 0 4px;
  text-align: center;
  font-size: 16px;
}

/* Dirección centrada */
.local-address {
  text-align: center;
  font-size: 14px;
  margin: 4px auto;
  max-width: 90%;
}

/* Descripción centrada */
.local-description {
  text-align: center;
  font-size: 13px;
  color: #333;
  margin-top: 4px;
  margin-bottom: 10px;
  font-style: italic;
}

/* Botones */
.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  outline: none;
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
  font-size: 13px;
  display: flex;
  align-items: center;
}

.buttons button:hover {
  background-color: #f3ff11;
}
</style>