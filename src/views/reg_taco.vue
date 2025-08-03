<template>
  <div class="contenedor">
    <h2>Registrar Sabores</h2>

    <div class="grupo">
      <div class="campo">
        <label>Sabor</label>
        <input v-model="form.sabor" type="text" placeholder="Ej. Mango con chile" />
      </div>
      <div class="campo">
        <label>Precio</label>
        <input v-model="form.precio" type="text" placeholder="Ej. 25.00" />
      </div>
    </div>

    <div class="campo campo-grande">
      <label>Descripción</label>
      <input
        v-model="form.descripcion"
        type="text"
        placeholder="Ej. Dulce, picante y refrescante"
      />
    </div>

    <div class="imagen-preview">
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

    <div class="acciones">
      <button class="registrar" @click="registrarSabor">Registrar</button>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "RegistroSabores",
  data() {
    return {
      form: {
        sabor: "",
        precio: "",
        descripcion: "",
        imagen: null, // base64 string
      },
      previewUrl: null,
    };
  },
  methods: {
    onImageChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.imagen = e.target.result; // base64 string
          if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
          this.previewUrl = URL.createObjectURL(file);
        };
        reader.readAsDataURL(file);
      } else {
        this.form.imagen = null;
        if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
        Swal.fire(
          "Imagen inválida",
          "Por favor selecciona una imagen válida.",
          "warning"
        );
      }
    },

    registrarSabor() {
      Swal.fire({
        title: "¿Desea registrar este sabor?",
        text: "Se guardará el nuevo sabor en el sistema.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#308a00",
        cancelButtonColor: "#aaa",
        confirmButtonText: "¡Sí, registrar sabor!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            sabor: this.form.sabor,
            precio: parseFloat(this.form.precio) || 0,
            descripcion: this.form.descripcion,
            imagen: this.form.imagen, // base64
            fk_local: 1,
          };

          fetch("http://localhost:3000/api/tacos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                Swal.fire(
                  "¡Registrado con éxito!",
                  "Sabor registrado exitosamente.",
                  "success"
                );
                this.resetForm();
              } else {
                throw new Error("No se pudo registrar.");
              }
            })
            .catch((err) => {
              console.error(err);
              Swal.fire("Error", "Hubo un problema al registrar el sabor.", "error");
            });
        }
      });
    },

    resetForm() {
      this.form = {
        sabor: "",
        precio: "",
        descripcion: "",
        imagen: null,
      };
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    },
  },

  beforeUnmount() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  },
};
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
  margin: 30px auto;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
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
  width: 100%;
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
  border: 1.6px solid #aaa;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="file"]:focus {
  border-color: #9e5700;
  outline: none;
}

.imagen-preview {
  margin-top: 30px;
}

.preview {
  margin-top: 10px;
  text-align: center;
}

.preview img {
  max-width: 240px;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  background: white;
  box-shadow: 0 0 5px #ccc;
}

.acciones {
  margin-top: 40px;
  text-align: center;
}

.registrar {
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background-color: #9e5700;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 0 8px #9e5700aa;
}

.registrar:hover {
  background-color: #7c4400;
  box-shadow: 0 0 12px #7c4400cc;
}

@media (max-width: 768px) {
  .grupo {
    flex-direction: column;
  }

  .campo {
    min-width: 100%;
  }

  .imagen-preview {
    text-align: center;
  }

  .preview img {
    max-width: 100%;
    aspect-ratio: 1/1;
  }

  .registrar {
    width: 100%;
  }
}
</style>
