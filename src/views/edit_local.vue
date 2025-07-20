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
        <input type="text" v-model="descripcion" placeholder="Breve descripción del local..." />
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
        <label>Imagen de Ubicación</label>
        <input type="file" accept="image/*" @change="onUbicacionChange" />
        <div class="preview" v-if="ubicacionPreviewUrl">
          <img :src="ubicacionPreviewUrl" alt="Vista previa ubicación" />
        </div>
      </div>

      <div class="imagen-preview">
        <label>Imagen del Local</label>
        <input type="file" accept="image/*" @change="onLocalChange" />
        <div class="preview" v-if="localPreviewUrl">
          <img :src="localPreviewUrl" alt="Vista previa local" />
        </div>
      </div>
    </div>

    <div class="acciones">
      <button class="editar" @click="() => showConfirmDialog('editar')">Editar</button>
      <button class="eliminar" @click="() => showConfirmDialog('eliminar')">Eliminar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";

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

const route = useRoute();

onMounted(() => {
  const id = route.query.id;
  if (id) {
    nombre.value = "Taco Real Tlaxcala";
    descripcion.value = "Un local tradicional con tacos de papa y más";
    calle.value = "Av. Reforma";
    ciudad.value = "Tlaxcala";
    codigoPostal.value = "90000";
    estado.value = "Tlaxcala";
    entreCalles.value = "Juárez y Allende";
    colonia.value = "Centro";
    ubicacionPreviewUrl.value = "https://via.placeholder.com/200x200?text=Ubicación";
    localPreviewUrl.value = "https://via.placeholder.com/200x200?text=Local";
  }
});

function onUbicacionChange(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    if (ubicacionPreviewUrl.value) URL.revokeObjectURL(ubicacionPreviewUrl.value);
    ubicacionFile.value = file;
    ubicacionPreviewUrl.value = URL.createObjectURL(file);
  } else {
    ubicacionPreviewUrl.value = null;
    ubicacionFile.value = null;
    alert("Por favor selecciona una imagen válida para la ubicación.");
  }
}

function onLocalChange(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    localFile.value = file;
    localPreviewUrl.value = URL.createObjectURL(file);
  } else {
    localPreviewUrl.value = null;
    localFile.value = null;
    alert("Por favor selecciona una imagen válida para el local.");
  }
}

function showConfirmDialog(accion) {
  const opciones = {
    editar: {
      title: "¿Seguro que quieres editar?",
      text: "Estás a punto de modificar los datos.",
      confirmButtonText: "Sí, editar",
      successTitle: "¡Editado!",
      successText: "El local fue actualizado.",
    },
    eliminar: {
      title: "¿Seguro que quieres eliminar?",
      text: "Esta acción no se puede deshacer.",
      confirmButtonText: "Sí, eliminar",
      successTitle: "¡Eliminado!",
      successText: "El local fue eliminado.",
    },
  };

  const { title, text, confirmButtonText, successTitle, successText } = opciones[accion];

  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: successTitle,
        text: successText,
        icon: "success",
      });
    }
  });
}

onBeforeUnmount(() => {
  if (ubicacionPreviewUrl.value) URL.revokeObjectURL(ubicacionPreviewUrl.value);
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
});
</script>

<style scoped>
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
