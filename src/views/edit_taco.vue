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
        <input type="text" v-model="descripcion" placeholder="Escribe la descripción..." />
      </div>
      <div class="campo">
        <label>Imagen</label>
        <input type="file" @change="onFileChange" accept="image/*" />
      </div>
    </div>

    <div class="fila">
      <div class="preview" v-if="previewUrl">
        <img :src="previewUrl" alt="Vista previa" />
      </div>
      <div class="botones">
        <button class="editar" @click="() => showConfirmDialog('editar')">Editar</button>
        <button class="eliminar" @click="() => showConfirmDialog('eliminar')">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditarProducto",
  data() {
    return {
      sabor: "",
      precio: "",
      descripcion: "",
      previewUrl: null,
      objectUrl: null,
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = URL.createObjectURL(file);
        this.previewUrl = this.objectUrl;
      } else {
        this.previewUrl = null;
        alert("Por favor selecciona una imagen válida.");
      }
    },
  },
  beforeDestroy() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  },
};
</script>

<script setup>
import Swal from "sweetalert2";

const showConfirmDialog = (action) => {
  const opciones = {
    editar: {
      title: "¿Seguro que quieres editar?",
      text: "Estás a punto de modificar el registro.",
      confirmButtonText: "Estoy seguro",
      successTitle: "¡Editado!",
      successText: "El registro ha sido editado.",
    },
    eliminar: {
      title: "¿Seguro que quieres eliminar?",
      text: "Esta acción no se puede deshacer.",
      confirmButtonText: "Sí, estoy seguro",
      successTitle: "¡Eliminado!",
      successText: "El registro ha sido eliminado.",
    },
  };

  const { title, text, confirmButtonText, successTitle, successText } = opciones[action];

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
};
</script>

<style scoped>
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