<template>
  <div class="contenedor">
    <h1>Editar sabor</h1>

    <div class="fila">
      <div class="campo">
        <label>Sabor</label>
        <input type="text" v-model="sabor" placeholder="Escribe el sabor..." />
      </div>
      <div class="campo">
        <label>Precio</label>
        <input type="number" v-model="precio" placeholder="Escribe el precio..." />
      </div>
    </div>

    <div class="fila">
      <div class="campo campo-grande">
        <label>Descripción</label>
        <input
          type="text"
          v-model="descripcion"
          placeholder="Escribe la descripción..."
        />
      </div>
      <div class="campo">
        <label>Imagen</label>
        <div class="input-file">
          <label class="input-file-label" for="imagen">🖼️Galería</label>
          <input
            type="file"
            id="imagen"
            @change="onFileChange"
            accept="image/*"
            class="file-input"
          />
        </div>
      </div>
    </div>

    <div class="fila">
      <div class="preview" v-if="previewUrl">
        <img :src="previewUrl" alt="Vista previa" />
      </div>
      <div class="botones">
        <button class="editar" @click="() => showConfirmDialog('editar')">Editar</button>
        <button class="eliminar" @click="() => showConfirmDialog('eliminar')">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const sabor = ref("");
const precio = ref("");
const descripcion = ref("");
const previewUrl = ref(null);
let imagenBase64 = "";
let objectUrl = null;

const cargarTaco = async () => {
  try {
    const res = await fetch(`/api/tacos/${id}`);
    const data = await res.json();
    sabor.value = data.sabor;
    precio.value = data.precio;
    descripcion.value = data.descripcion;
    previewUrl.value = data.imagen;
    imagenBase64 = data.imagen;
  } catch (e) {
    alert("Error al cargar taco");
  }
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      imagenBase64 = reader.result;
      previewUrl.value = reader.result;
    };
    reader.readAsDataURL(file);

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
  } else {
    alert("Por favor selecciona una imagen válida.");
  }
};

const showConfirmDialog = (action) => {
  const opciones = {
    editar: {
      title: "¿Seguro que quieres editar?",
      text: "Estás a punto de modificar el registro.",
      confirmButtonText: "Estoy seguro",
      successTitle: "¡Editado!",
      successText: "El registro ha sido editado.",
      onConfirm: actualizarTaco,
    },
    eliminar: {
      title: "¿Seguro que quieres eliminar?",
      text: "Esta acción no se puede deshacer.",
      confirmButtonText: "Sí, estoy seguro",
      successTitle: "¡Eliminado!",
      successText: "El registro ha sido eliminado.",
      onConfirm: eliminarTaco,
    },
  };

  const {
    title,
    text,
    confirmButtonText,
    successTitle,
    successText,
    onConfirm,
  } = opciones[action];

  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onConfirm();
      Swal.fire({
        title: successTitle,
        text: successText,
        icon: "success",
      });
      router.push("/sabores");
    }
  });
};

const actualizarTaco = async () => {
  const res = await fetch(`/api/tacos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sabor: sabor.value,
      precio: precio.value,
      descripcion: descripcion.value,
      imagen: imagenBase64,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    alert("Error al actualizar taco: " + err.error);
  }
};

const eliminarTaco = async () => {
  const res = await fetch(`/api/tacos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    alert("Error al eliminar taco: " + err.error);
  }
};

onMounted(() => {
  cargarTaco();
});

onUnmounted(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
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
  padding: 13px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 16px;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  margin: 0px 0 10px 0; /* mismo margen vertical que los otros campos */
  text-align: left; /* alinea el texto como en los inputs */
}

.input-file-label:hover {
  background-color: #ddd;
}

.contenedor {
  max-width: 950px;
  margin: 20px auto;
  padding: 25px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.fila {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.campo {
  flex: 1;
  min-width: 400px;
  display: flex;
  flex-direction: column;
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
input[type="number"],
input[type="file"] {
  padding: 14px 18px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  width: 100%;
}

.preview {
  flex: 1;
  border: 1px dashed #ccc;
  background-color: #eee;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  min-width: 240px;
}

.preview img {
  max-width: 240px;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
}

.botones {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.editar,
.eliminar {
  padding: 12px 22px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.editar {
  background-color: #ffe600;
  color: black;
}

.eliminar {
  background-color: #d33;
  color: white;
}

@media (max-width: 768px) {
  .fila {
    flex-direction: column;
  }

  .campo {
    min-width: 100%;
  }

  .botones {
    justify-content: center;
    margin-top: 20px;
  }
}
</style>