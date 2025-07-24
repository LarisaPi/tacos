<template>
  <div class="contenedor">
    <h1>Registrar Usuario</h1>

    <!-- Datos básicos -->
    <div class="grupo">
      <div class="campo">
        <label>Nombre</label>
        <input v-model="form.nombre" type="text" placeholder="Ej. Juan" />
      </div>
      <div class="campo">
        <label>Apellidos</label>
        <input v-model="form.apellidos" type="text" placeholder="Ej. Pérez García" />
      </div>
    </div>

    <div class="grupo">
      <div class="campo">
        <label>Contacto</label>
        <input
          v-model="form.contacto"
          type="text"
          placeholder="Ej. 555-123-4567 / correo@example.com"
        />
      </div>
      <div class="campo">
        <label>Tipo de usuario</label>
        <select v-model="form.tipo_usuario">
          <option value="admin">Administrador</option>
          <option value="vendedor">Empleado</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>
    </div>

    <!-- Correo y Contraseña -->
    <div class="grupo">
      <div class="campo">
        <label>Correo electrónico</label>
        <input
          v-model="form.correo_electronico"
          type="email"
          placeholder="Ej. usuario@ejemplo.com"
        />
      </div>
      <div class="campo">
        <label>Contraseña</label>
        <input
          v-model="form.contrasena"
          type="password"
          placeholder="Ingrese una contraseña segura"
        />
      </div>
    </div>

    <!-- Dirección -->
    <h3>Dirección</h3>
    <div class="grupo">
      <div class="campo">
        <label>Calle</label>
        <input v-model="form.direccion.calle" type="text" placeholder="Ej. Av. Reforma" />
      </div>
      <div class="campo">
        <label>Ciudad</label>
        <input
          v-model="form.direccion.ciudad"
          type="text"
          placeholder="Ej. Ciudad de México"
        />
      </div>
    </div>

    <div class="grupo">
      <div class="campo">
        <label>Código postal</label>
        <input
          v-model="form.direccion.codigo_postal"
          type="text"
          placeholder="Ej. 06000"
        />
      </div>
      <div class="campo">
        <label>Estado / Provincia / Zona</label>
        <input
          v-model="form.direccion.estado_provincia_zona"
          type="text"
          placeholder="Ej. CDMX"
        />
      </div>
    </div>

    <div class="campo">
      <label>Entre calles</label>
      <input
        v-model="form.direccion.entre_calles"
        type="text"
        placeholder="Ej. Juárez y Madero"
      />
    </div>

    <!-- Imagen de perfil -->
    <div class="campo">
      <label>Imagen de perfil</label>
      <div class="input-file">
        <label class="input-file-label" for="imagenPerfil">🖼️ Galería</label>
        <input
          type="file"
          id="imagenPerfil"
          accept="image/*"
          @change="onUsuarioImageChange"
          class="file-input"
        />
      </div>

      <!-- Vista previa -->
      <div v-if="usuarioPreviewUrl" class="preview">
        <img :src="usuarioPreviewUrl" alt="Vista previa de perfil" />
      </div>
    </div>

    <!-- Botón -->
    <div class="acciones">
      <button class="registrar" @click="registrarUsuario">Registrar</button>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "RegistroUsuario",
  data() {
    return {
      form: {
        nombre: "",
        apellidos: "",
        contacto: "",
        tipo_usuario: "",
        correo_electronico: "",
        contrasena: "",
        direccion: {
          calle: "",
          ciudad: "",
          codigo_postal: "",
          estado_provincia_zona: "",
          entre_calles: "",
        },
        foto_perfil: null,
      },
      usuarioPreviewUrl: null,
    };
  },
  methods: {
    onUsuarioImageChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.foto_perfil = e.target.result;
          if (this.usuarioPreviewUrl) URL.revokeObjectURL(this.usuarioPreviewUrl);
          this.usuarioPreviewUrl = URL.createObjectURL(file);
        };
        reader.readAsDataURL(file);
      } else {
        this.form.foto_perfil = null;
        if (this.usuarioPreviewUrl) URL.revokeObjectURL(this.usuarioPreviewUrl);
        this.usuarioPreviewUrl = null;
        Swal.fire(
          "Imagen inválida",
          "Por favor selecciona una imagen válida.",
          "warning"
        );
      }
    },
    registrarUsuario() {
      Swal.fire({
        title: "¿Desea registrar este usuario?",
        text: "Se guardará el nuevo usuario en el sistema.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FFF07F",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, registrar usuario!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            nombre: this.form.nombre,
            apellidos: this.form.apellidos,
            contacto: this.form.contacto,
            tipo_usuario: this.form.tipo_usuario,
            correo_electronico: this.form.correo_electronico,
            contrasena: this.form.contrasena,
            calle: this.form.direccion.calle,
            ciudad: this.form.direccion.ciudad,
            codigo_postal: parseInt(this.form.direccion.codigo_postal) || null,
            estado_provincia_zona: this.form.direccion.estado_provincia_zona,
            entre_calles: this.form.direccion.entre_calles,
            foto_perfil: this.form.foto_perfil,
          };

          fetch("http://localhost:3000/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                Swal.fire(
                  "¡Registrado con éxito!",
                  "Usuario registrado exitosamente.",
                  "success"
                );
                this.resetForm();
              } else {
                throw new Error("No se pudo registrar.");
              }
            })
            .catch((err) => {
              console.error(err);
              Swal.fire("Error", "Hubo un problema al registrar el usuario.", "error");
            });
        }
      });
    },
    resetForm() {
      this.form = {
        nombre: "",
        apellidos: "",
        contacto: "",
        tipo_usuario: "",
        correo_electronico: "",
        contrasena: "",
        direccion: {
          calle: "",
          ciudad: "",
          codigo_postal: "",
          estado_provincia_zona: "",
          entre_calles: "",
        },
        foto_perfil: null,
      };
      if (this.usuarioPreviewUrl) URL.revokeObjectURL(this.usuarioPreviewUrl);
      this.usuarioPreviewUrl = null;
    },
  },
  beforeUnmount() {
    if (this.usuarioPreviewUrl) URL.revokeObjectURL(this.usuarioPreviewUrl);
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
  max-width: 950px;
  margin: 30px auto;
  padding: 30px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
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

label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
}

input[type="text"],
input[type="email"],
input[type="password"],
select,
input[type="file"] {
  padding: 14px 18px;
  font-size: 16px;
  border: 1.6px solid #aaa;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
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
  background-color: #4caf50;
  color: white;
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
