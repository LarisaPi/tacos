<template>
  <div class="page">
    <h1 class="title">Sabor que no se olvida</h1>

    <section class="intro-section">
      <h2 class="section-title">Chiquihuitl Tacos</h2>
      <img
        :src="editingIntro ? tempIntroImage || introImage : introImage"
        alt="Grupo con tacos de canasta"
        class="main-image"
        @click="activarIntroEdicion"
      />
      <div v-if="rolPermitido && editingIntro">
        <input
          type="file"
          id="intro-upload"
          @change="handleIntroImageChange"
          style="display: none"
        />
        <label for="intro-upload" class="input-file-label">
          🖼️ Haz clic aquí para cambiar la imagen
        </label>
        <textarea v-model="tempIntroText" placeholder="Texto de introducción..." />
        <button @click="confirmIntroEdit">Guardar</button>
        <button @click="cancelIntroEdit">Cancelar</button>
      </div>
      <p v-else @click="activarIntroEdicion">{{ introText }}</p>
    </section>

    <section class="gallery">
      <div class="image-block" v-for="(item, index) in galleryItems" :key="index">
        <img
          :src="item.img"
          :alt="item.alt"
          @click="rolPermitido && startEditing(index)"
        />
        <div v-if="rolPermitido && editingIndex === index">
          <input
            type="file"
            id="gallery-upload"
            @change="handleFileChange($event)"
            style="display: none"
          />
          <label for="gallery-upload" class="input-file-label">
            🖼️ Haz clic aquí para cambiar la imagen
          </label>
          <textarea v-model="tempText" />
          <button @click="confirmEdit(index)">Guardar</button>
          <button @click="cancelEdit">Cancelar</button>
          <button @click="removeItem(index)">Eliminar</button>
        </div>
        <p v-else @click="rolPermitido && startEditing(index)">
          {{ item.text }}
        </p>
      </div>

      <div class="new-block" v-if="rolPermitido">
        <button @click="startNew">Agregar taco nuevo</button>
        <div v-if="addingNew">
          <input type="file" @change="handleNewImage" />
          <textarea v-model="newText" placeholder="Texto del nuevo taco..." />
          <button @click="saveNew">Guardar</button>
          <button @click="cancelNew">Cancelar</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "inicio",
  props: {
    rolUsuario: {
      type: String,
      default: "visitante",
    },
  },
  data() {
    return {
      introImage: "",
      introText: "",
      editingIntro: false,
      tempIntroText: "",
      tempIntroImage: null,

      galleryItems: [],
      editingIndex: null,
      tempText: "",
      tempImage: null,
      addingNew: false,
      newImage: null,
      newText: "",
    };
  },
  computed: {
    rolPermitido() {
      return ["admin", "vendedor"].includes(this.rolUsuario);
    },
  },
  mounted() {
    this.fetchIntroContent();

    const localGallery = localStorage.getItem("galleryItems");
    if (localGallery) {
      this.galleryItems = JSON.parse(localGallery);
    }
  },
  methods: {
    activarIntroEdicion() {
      if (this.rolPermitido) {
        this.startIntroEdit();
      }
    },
    startIntroEdit() {
      this.editingIntro = true;
      this.tempIntroText = this.introText;
      this.tempIntroImage = this.introImage;
    },
    handleIntroImageChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.tempIntroImage = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async confirmIntroEdit() {
      this.introText = this.tempIntroText;
      this.introImage = this.tempIntroImage;
      this.editingIntro = false;

      try {
        const res = await fetch("http://localhost:3000/api/intro", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imagen: this.introImage,
            texto: this.introText,
          }),
        });

        if (res.ok) {
          console.log("✅ Guardado exitosamente");
        } else {
          console.error("❌ Error al guardar:", await res.text());
        }

        localStorage.setItem("introImage", this.introImage);
        localStorage.setItem("introText", this.introText);
      } catch (err) {
        console.error("⚠️ Error de conexión al guardar:", err);
      }
    },
    cancelIntroEdit() {
      this.editingIntro = false;
    },
    async fetchIntroContent() {
      try {
        const res = await fetch("http://localhost:3000/api/intro");
        const data = await res.json();

        if (data.imagen && data.texto) {
          this.introImage = data.imagen.startsWith("data:image")
            ? data.imagen
            : `data:image/png;base64,${data.imagen}`;
          this.introText = data.texto;

          localStorage.setItem("introImage", this.introImage);
          localStorage.setItem("introText", this.introText);
        } else {
          this.introImage = localStorage.getItem("introImage") || "";
          this.introText = localStorage.getItem("introText") || "";
        }
      } catch (err) {
        console.error("❌ Error al cargar introducción:", err);
        this.introImage = localStorage.getItem("introImage") || "";
        this.introText = localStorage.getItem("introText") || "";
      }
    },

    startEditing(index) {
      this.editingIndex = index;
      this.tempText = this.galleryItems[index].text;
      this.tempImage = this.galleryItems[index].img;
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.tempImage = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    confirmEdit(index) {
      this.galleryItems[index].text = this.tempText;
      this.galleryItems[index].img = this.tempImage;
      this.editingIndex = null;
      localStorage.setItem("galleryItems", JSON.stringify(this.galleryItems));
    },
    cancelEdit() {
      this.editingIndex = null;
    },
    removeItem(index) {
      this.galleryItems.splice(index, 1);
      localStorage.setItem("galleryItems", JSON.stringify(this.galleryItems));
    },
    startNew() {
      this.addingNew = true;
    },
    handleNewImage(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.newImage = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    saveNew() {
      if (this.newImage && this.newText.trim()) {
        this.galleryItems.push({
          img: this.newImage,
          alt: "Nuevo taco",
          text: this.newText,
        });
        this.cancelNew();
        localStorage.setItem("galleryItems", JSON.stringify(this.galleryItems));
      }
    },
    cancelNew() {
      this.addingNew = false;
      this.newImage = null;
      this.newText = "";
    },
  },
};
</script>

<style scoped>
.input-file-label {
  display: inline-block;
  padding: 6px 12px;
  background-color: #ff9a70;
  color: rgb(8, 8, 8);
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
}

.input-file-label:hover {
  background-color: #e87f52;
}

.page {
  background-color: white;
  padding: 16px;
  font-family: "Arial", sans-serif;
}
.title {
  text-align: center;
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
  text-align: center;
  font-size: 1.8rem;
  color: #0f0e0e;
  margin-bottom: 16px;
  font-weight: bold;
}
.main-image {
  width: 100%;
  max-width: 600px;
  margin: auto auto 10px;
  border-radius: 8px;
  display: block;
}
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.image-block {
  text-align: center;
  background-color: #f7b998;
  padding: 10px;
  border-radius: 8px;
}
.image-block img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 6px;
  margin-bottom: 6px;
  display: block;
  margin: auto;
}
.image-block p,
textarea {
  text-align: justify;
  padding: 0 10px;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
  width: 100%;
}
.new-block {
  grid-column: span 2;
  text-align: center;
  padding: 10px;
}
button {
  margin: 6px;
  padding: 6px 12px;
  border: none;
  background-color: #f1aa12;
  color: rgb(8, 8, 8);
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #fa543f;
}
</style>
