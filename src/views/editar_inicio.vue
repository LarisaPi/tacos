<template>
  <div class="contenedor">
    <h1>Editar Página de Inicio</h1>

    <!-- Portada -->
    <div class="campo">
      <label>Título Principal</label>
      <input type="text" v-model="portada.titulo" placeholder="Título de la portada" />
    </div>

    <div class="campo">
      <label>Texto de Portada</label>
      <input
        type="text"
        v-model="portada.texto"
        placeholder="Descripción breve de la portada"
      />
    </div>

    <div class="campo">
      <label class="input-file-label" for="imagenPortada">🖼️ Imagen de Portada</label>
      <input
        id="imagenPortada"
        type="file"
        accept="image/*"
        @change="onPortadaChange"
        style="display: none"
      />
      <div class="preview" v-if="portadaPreviewUrl">
        <img :src="portadaPreviewUrl" alt="Vista previa portada" />
      </div>
    </div>

    <!-- Galería -->
    <h3>Galería (6 bloques)</h3>
    <div class="grupo" v-for="(item, i) in galeria" :key="i">
      <div class="campo">
        <label>Texto bloque {{ i + 1 }}</label>
        <input type="text" v-model="item.texto" placeholder="Texto para este bloque" />
      </div>

      <div class="campo">
        <label>Imagen bloque {{ i + 1 }}</label>
        <input type="file" accept="image/*" @change="onGaleriaChange($event, i)" />
        <div class="preview" v-if="item.previewUrl">
          <img :src="item.previewUrl" :alt="'Vista previa galería ' + (i + 1)" />
        </div>
      </div>
    </div>

    <div class="acciones">
      <button class="editar" @click="guardarCambios">Guardar Todo</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

const portada = ref({ id: null, tipo: "portada", titulo: "", texto: "", imagen: "" });
const portadaFile = ref(null);
const portadaPreviewUrl = ref(null);

const galeria = ref([]);

// Carga inicial
onMounted(async () => {
  try {
    const res = await fetch("/api/contenido-inicio");
    const data = await res.json();

    // Portada
    const port = data.find((i) => i.tipo === "portada");
    if (port) {
      portada.value = { ...port };
      portadaPreviewUrl.value = port.imagen;
    }

    // Galería
    let bloques = data
      .filter((i) => i.tipo === "galeria")
      .map((b) => ({ ...b, file: null, previewUrl: b.imagen || null }));

    while (bloques.length < 6) {
      bloques.push({
        id: null,
        tipo: "galeria",
        titulo: "",
        texto: "",
        imagen: "",
        orden: bloques.length + 1,
        file: null,
        previewUrl: null,
      });
    }

    galeria.value = bloques;
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo cargar contenido de inicio.", "error");
  }
});

// Manejo de archivos
function onPortadaChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  portadaFile.value = file;
  if (portadaPreviewUrl.value) URL.revokeObjectURL(portadaPreviewUrl.value);
  portadaPreviewUrl.value = URL.createObjectURL(file);
}

function onGaleriaChange(e, index) {
  const file = e.target.files[0];
  if (!file) return;
  galeria.value[index].file = file;
  if (galeria.value[index].previewUrl)
    URL.revokeObjectURL(galeria.value[index].previewUrl);
  galeria.value[index].previewUrl = URL.createObjectURL(file);
}

// File → Base64
function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// Guardar cambios
async function guardarCambios() {
  try {
    // Portada (PUT)
    const portadaB64 = await fileToBase64(portadaFile.value);
    await fetch(`/api/contenido-inicio/${portada.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: portada.value.titulo,
        texto: portada.value.texto,
        imagen: portadaB64 || portada.value.imagen,
      }),
    });

    // Galería (PUT/POST)
    for (let i = 0; i < galeria.value.length; i++) {
      const item = galeria.value[i];
      const imgB64 = await fileToBase64(item.file);

      if (item.id) {
        await fetch(`/api/contenido-inicio/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: item.titulo,
            texto: item.texto,
            imagen: imgB64 || item.imagen,
          }),
        });
      } else {
        const res = await fetch(`/api/contenido-inicio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "galeria",
            titulo: item.titulo,
            texto: item.texto,
            imagen: imgB64 || item.imagen,
            orden: i + 1,
          }),
        });
        const created = await res.json();
        item.id = created.id;
        item.imagen = created.imagen;
      }
    }

    Swal.fire("¡Listo!", "Contenido de inicio actualizado.", "success");
    router.push("/inicio");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
  }
}

// Limpieza de URLs
onBeforeUnmount(() => {
  if (portadaPreviewUrl.value) URL.revokeObjectURL(portadaPreviewUrl.value);
  galeria.value.forEach((item) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  });
});
</script>

<style scoped>
.input-file input[type="file"] {
  display: none;
}

.campo {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 5px 5px 10px -5px; /* reducido margen arriba y extendido a la izquierda */
  width: 100%; /* aseguramos que ocupe todo el ancho disponible */
}

input[type="text"],
input[type="file"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #e2dfdf;
  font-size: 16px;
}

/* Estilo del botón de archivo personalizado */
.input-file-label {
  display: flex; /* para controlar alineación interna */
  align-items: center; /* centra verticalmente */
  justify-content: center; /* centra el ícono horizontalmente */
  width: 100%; /* que ocupe todo el ancho disponible */
  max-width: 100%; /* para no salirse */
  padding: 12px 0; /* padding arriba/abajo, nada a los lados */
  background-color: #eee;
  border: 1px solid #bbb;
  border-radius: 6px;
  font-size: 20px; /* tamaño del ícono */
  cursor: pointer;
  margin-top: -1px;
  margin-left: 0; /* quito margen izquierdo para que quede alineado */
  box-sizing: border-box; /* para que padding y border no agranden el ancho */
  transition: background-color 0.2s ease;
}

.input-file-label:hover {
  background-color: #ddd;
}

.contenedor {
  max-width: 900px;
  margin: 20px auto;
  padding: 25px;
  background: #fff;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
}

h1 {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
}

h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 30px 0 10px;
}

.grupo {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.campo {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
}

input[type="text"],
input[type="file"] {
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f9f9f9;
  width: 100%;
}

.preview {
  margin-top: 10px;
  border: 2px dashed #ccc;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.acciones {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.editar {
  background-color: #ffe600;
  color: #000;
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.editar:hover {
  background-color: #e6d100;
}

@media (max-width: 768px) {
  .grupo {
    flex-direction: column;
  }

  .preview {
    height: auto;
    aspect-ratio: 1 / 1;
  }

  .acciones {
    flex-direction: column;
  }
}
</style>
