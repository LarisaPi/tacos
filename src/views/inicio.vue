<template>
  <div class="page">
    <h1 class="title">{{ portada.titulo }}</h1>

    <section class="intro-section">
      <h2 class="section-title">{{ portada.titulo }}</h2>
      <img :src="portada.imagen" alt="Grupo con tacos de canasta" class="main-image" />
      <p class="section-text">{{ portada.texto }}</p>

      <!-- Botón condicional por rol -->
      <div class="edit-btn-container" v-if="rolValido">
        <router-link to="/editar-inicio" class="edit-btn"
          >✏️ Editar contenido</router-link
        >
      </div>
    </section>

    <section class="gallery">
      <div v-for="(item, index) in galeriaCompleta" :key="index" class="image-block">
        <div class="image-wrapper">
          <img :src="item.imagen" :alt="'Galería ' + index" />
        </div>
        <p>{{ item.texto }}</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Inicio",
  data() {
    return {
      portada: {
        titulo: "Sabor que no se olvida",
        texto: "En Chiquihuitl Tacos llevamos la tradición en alto...",
        imagen: "/img/tacostlaxcala.png",
      },
      galeria: [],
    };
  },
  computed: {
    rolValido() {
      const rol = this.$route.params.rol;
      return ["admin", "vendedor"].includes(rol);
    },
    galeriaCompleta() {
      const defaultItem = {
        imagen: "/img/default.png",
        texto: "Contenido pendiente...",
      };
      const actual = [...this.galeria];
      while (actual.length < 6) actual.push({ ...defaultItem });
      return actual;
    },
  },
  async mounted() {
    try {
      const res = await fetch("/api/contenido-inicio");
      const data = await res.json();
      const portadaItem = data.find((i) => i.tipo === "portada");
      if (portadaItem) this.portada = portadaItem;
      this.galeria = data.filter((i) => i.tipo === "galeria");
    } catch (e) {
      console.error("Error al cargar contenido:", e);
    }
  },
};
</script>



<style scoped>
.page {
  background-color: white;
  padding: 16px;
  font-family: "Arial", sans-serif;
  text-align: center; /* ⬅️ Esto centra todo el texto */
}

.title {
  font-size: 2.2rem;
  font-weight: bold;
  background-color: #fbd2c9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.intro-section {
  background-color: #f7b998;
  padding: 20px;
  border-radius: 10px;
  color: rgb(15, 15, 15);
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.8rem;
  color: #0f0e0e;
  margin-bottom: 16px;
  font-weight: bold;
}

.section-text {
  font-size: 1rem;
  color: #333;
}

.main-image {
  width: 100%;
  max-width: 600px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.image-block {
  background-color: #f7b998;
  padding: 10px;
  border-radius: 8px;
}

.image-wrapper {
  width: 100%;
  max-width: 400px;
  height: 200px;
  overflow: hidden;
  margin: 0 auto 6px;
  border-radius: 6px;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-block p {
  font-size: 0.9rem;
  color: #333;
  text-align: center;
}

.edit-btn-container {
  text-align: center;
  margin-top: 10px;
}

.edit-btn {
  background-color: #ffc107;
  color: #000;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.edit-btn:hover {
  background-color: #e0a800;
}
</style>
