<template>
  <div class="contenedor">
    <h1>Registrar Local</h1>

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
      <button class="registrar" @click="showConfirmDialog">Registrar</button>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "RegistrarLocal",
  data() {
    return {
      nombre: "",
      calle: "",
      ciudad: "",
      codigoPostal: "",
      estado: "",
      entreCalles: "",
      colonia: "",
      descripcion: "",
      ubicacionFile: null,
      ubicacionPreviewUrl: null,
      localFile: null,
      localPreviewUrl: null,
    };
  },
  methods: {
    onUbicacionChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.ubicacionFile = file;
        this.ubicacionPreviewUrl = URL.createObjectURL(file);
      } else {
        this.ubicacionFile = null;
        this.ubicacionPreviewUrl = null;
        Swal.fire("Error", "Selecciona una imagen válida para la ubicación.", "warning");
      }
    },
    onLocalChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.localFile = file;
        this.localPreviewUrl = URL.createObjectURL(file);
      } else {
        this.localFile = null;
        this.localPreviewUrl = null;
        Swal.fire("Error", "Selecciona una imagen válida para el local.", "warning");
      }
    },
    async showConfirmDialog() {
      const confirm = await Swal.fire({
        title: "¿Deseas registrar este local?",
        text: "Se guardarán los datos ingresados.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#308a00",
        cancelButtonColor: "#aaa",
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) return;

      try {
        const [fotoLocalBase64, ubicacionBase64] = await Promise.all([
          this.fileToBase64(this.localFile),
          this.fileToBase64(this.ubicacionFile),
        ]);

        const data = {
          nombre: this.nombre,
          descripcion: this.descripcion,
          calle: this.calle,
          ciudad: this.ciudad,
          codigo_postal: this.codigoPostal,
          estado: this.estado,
          entre_calles: this.entreCalles,
          colonia: this.colonia,
          // ¡aquí pasamos camelCase!
          fotoLocal: fotoLocalBase64,
          imagenUbicacion: ubicacionBase64,
          fk_vendedor: 1,
        };

        const res = await fetch("/api/locales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        if (result.success) {
          Swal.fire(
            "¡Registrado!",
            "El local se ha registrado correctamente.",
            "success"
          );
          this.resetForm();
        } else {
          throw new Error(result.error || "No se pudo registrar el local.");
        }
      } catch (error) {
        console.error("Error al registrar:", error);
        Swal.fire("Error", error.message, "error");
      }
    },
    fileToBase64(file) {
      return new Promise((resolve) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    },
    resetForm() {
      this.nombre = "";
      this.descripcion = "";
      this.calle = "";
      this.ciudad = "";
      this.codigoPostal = "";
      this.estado = "";
      this.entreCalles = "";
      this.colonia = "";
      this.ubicacionFile = null;
      this.ubicacionPreviewUrl = null;
      this.localFile = null;
      this.localPreviewUrl = null;
    },
  },
  beforeUnmount() {
    if (this.ubicacionPreviewUrl) URL.revokeObjectURL(this.ubicacionPreviewUrl);
    if (this.localPreviewUrl) URL.revokeObjectURL(this.localPreviewUrl);
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
}

.registrar {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  background-color: #4caf50;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 0 8px #4caf50aa;
}

.registrar:hover {
  background-color: #388e3c;
  box-shadow: 0 0 12px #388e3ccc;
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
}
</style>
