<template>
  <div class="contenedor">
    <h1>Editar Local</h1>

    <div class="grupo">
      <div class="campo">
        <label>Nombre del Local</label>
        <input type="text" v-model="nombre" placeholder="Ej. Tacos Don Memo" />
      </div>
      <div class="campo campo-grande">
        <label>Descripción</label>
        <input
          type="text"
          v-model="descripcion"
          placeholder="Breve descripción del local..."
        />
      </div>
    </div>

    <h3>Dirección</h3>
    <div class="grupo">
      <div class="campo">
        <label>Calle</label>
        <input type="text" v-model="calle" placeholder="Ej. Av. Reforma" />
      </div>
      <div class="campo">
        <label>Ciudad</label>
        <input type="text" v-model="ciudad" placeholder="Ej. Ciudad de México" />
      </div>
    </div>

    <div class="grupo">
      <div class="campo">
        <label>Código Postal</label>
        <input type="text" v-model="codigoPostal" placeholder="Ej. 06000" />
      </div>
      <div class="campo">
        <label>Estado / Provincia / Zona</label>
        <input type="text" v-model="estado" placeholder="Ej. CDMX" />
      </div>
    </div>

    <div class="campo">
      <label>Entre calles</label>
      <input type="text" v-model="entreCalles" placeholder="Ej. Juárez y Madero" />
    </div>

    <div class="campo">
      <label>Colonia</label>
      <input type="text" v-model="colonia" placeholder="Ej. Centro" />
    </div>

    <div class="imagenes">
      <div class="imagen-preview">
        <label for="ubicacionFile" class="input-file-label">🗺️Galería Ubicación</label>
        <input
          id="ubicacionFile"
          type="file"
          accept="image/*"
          @change="onUbicacionChange"
          style="display: none"
        />
        <div class="preview" v-if="ubicacionPreviewUrl">
          <img :src="ubicacionPreviewUrl" alt="Vista previa ubicación" />
        </div>
      </div>

      <div class="imagen-preview">
        <label for="localFile" class="input-file-label">🖼️Galería Local</label>
        <input
          id="localFile"
          type="file"
          accept="image/*"
          @change="onLocalChange"
          style="display: none"
        />
        <div class="preview" v-if="localPreviewUrl">
          <img :src="localPreviewUrl" alt="Vista previa local" />
        </div>
      </div>
    </div>
    <div class="acciones">
      <button class="editar" @click="showConfirmDialog('editar')">Editar</button>
      <button class="eliminar" @click="showConfirmDialog('eliminar')">Eliminar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const id = route.params.id; // <-- obtener id por params

const nombre = ref("");
const descripcion = ref("");
const calle = ref("");
const ciudad = ref("");
const codigoPostal = ref("");
const estado = ref("");
const entreCalles = ref("");
const colonia = ref("");
const ubicacionFile = ref(null);
const localFile = ref(null);
const ubicacionPreviewUrl = ref(null);
const localPreviewUrl = ref(null);

onMounted(async () => {
  if (!id) {
    Swal.fire("Error", "No se encontró el ID del local.", "error");
    router.push("/locales");
    return;
  }

  try {
    const res = await fetch(`/api/locales/${id}`);
    if (!res.ok) throw new Error("Error al obtener local");
    const data = await res.json();

    nombre.value = data.nombre_local;
    descripcion.value = data.descripcion;
    calle.value = data.calle;
    ciudad.value = data.ciudad;
    codigoPostal.value = data.codigo_postal;
    estado.value = data.estado;
    entreCalles.value = data.entre_calles;
    colonia.value = data.colonia;
    ubicacionPreviewUrl.value = data.imagen_ubicacion;
    localPreviewUrl.value = data.foto_local;
  } catch (e) {
    Swal.fire("Error", "No se pudo cargar el local.", "error");
    router.push("/locales");
  }
});

function onUbicacionChange(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    if (ubicacionPreviewUrl.value) URL.revokeObjectURL(ubicacionPreviewUrl.value);
    ubicacionFile.value = file;
    ubicacionPreviewUrl.value = URL.createObjectURL(file);
  }
}

function onLocalChange(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    localFile.value = file;
    localPreviewUrl.value = URL.createObjectURL(file);
  }
}

function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function guardarCambios() {
  const result = await Swal.fire({
    title: "¿Seguro que quieres editar?",
    text: "Se actualizarán los datos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, editar",
  });
  if (!result.isConfirmed) return;

  const [fotoLocalB64, ubicB64] = await Promise.all([
    fileToBase64(localFile.value),
    fileToBase64(ubicacionFile.value),
  ]);

  const body = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    calle: calle.value,
    ciudad: ciudad.value,
    codigo_postal: codigoPostal.value,
    estado: estado.value,
    entre_calles: entreCalles.value,
    colonia: colonia.value,
    fotoLocal: fotoLocalB64 || localPreviewUrl.value,
    imagenUbicacion: ubicB64 || ubicacionPreviewUrl.value,
  };

  try {
    const res = await fetch(`/api/locales/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "No se pudo editar.");
    }

    Swal.fire("¡Listo!", "El local fue actualizado.", "success");
    router.push("/locales");
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
}

async function eliminarLocal() {
  const result = await Swal.fire({
    title: "¿Seguro que quieres eliminar?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
  });
  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`/api/locales/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "No se pudo eliminar.");
    }
    Swal.fire("¡Listo!", "El local fue eliminado.", "success");
    router.push("/locales");
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
}

onBeforeUnmount(() => {
  if (ubicacionPreviewUrl.value) URL.revokeObjectURL(ubicacionPreviewUrl.value);
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
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
  background-color: #f9f9f9;
  font-size: 16px;
}

/* Estilo del botón de archivo personalizado */
.input-file-label {
  display: block;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 16px;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
  margin: 5px 0 10px 0; /* mismo margen que los inputs de texto */
}

.input-file-label:hover {
  background-color: #ddd;
}

.contenedor {
  max-width: 950px;
  margin: 20px auto;
  padding: 25px;
  background: #fff;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 26px;
  font-weight: 700;
}

h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 30px 0 10px;
}

.grupo {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.campo {
  flex: 1;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.campo-grande {
  flex: 2;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
}

input[type="text"],
input[type="file"] {
  padding: 14px 18px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  width: 100%;
}

.imagenes {
  display: flex;
  gap: 30px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.imagen-preview {
  flex: 1;
  min-width: 280px;
}

.preview {
  margin-top: 10px;
  border: 2px dashed #ccc;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  height: 220px;
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
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.editar,
.eliminar {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.editar {
  background-color: #ffe600;
  color: black;
}

.editar:hover {
  background-color: #e6d100;
}

.eliminar {
  background-color: #d33;
  color: white;
}

.eliminar:hover {
  background-color: #b30000;
}

@media (max-width: 768px) {
  .grupo {
    flex-direction: column;
  }

  .campo {
    min-width: 100%;
  }

  .imagenes {
    flex-direction: column;
  }

  .preview {
    height: auto;
    aspect-ratio: 1 / 1;
  }

  .acciones {
    flex-direction: column;
    align-items: center;
  }
}
</style>
