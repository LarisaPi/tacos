<template>
  <br />
  <h2>Registrar Local</h2>

  <!-- Cuadros de imagen y ubicación -->
  <div class="form-row image-upload">
    <div class="placeholder-container">
      <label>Imagen</label>
      <div class="imagen-placeholder"></div>
    </div>
    <div class="placeholder-container">
      <label>Ubicación</label>
      <div class="imagen-placeholder"></div>
    </div>
  </div>

  <div class="registro-container">
    <form @submit.prevent="registrarUsuario" id="myform">
      <div class="form-row">
        <label>Nombre:</label>
        <input v-model="form.nombre" type="text" />
      </div>

      <div class="form-row">
        <label>Apellidos:</label>
        <input v-model="form.apellidos" type="text" />
      </div>

      <div class="form-row">
        <label>Contacto:</label>
        <input v-model="form.contacto" type="text" />
      </div>

      <div class="form-row">
        <label>Nombre de dueño</label>
        <input v-model="form.usuario" type="text" />
      </div>

      <h3>Dirección:</h3>
      <div class="direccion-grid">
        <div>
          <label>Calle:</label>
          <input v-model="form.direccion.calle" type="text" />
        </div>
        <div>
          <label>Ciudad:</label>
          <input v-model="form.direccion.ciudad" type="text" />
        </div>
        <div>
          <label>Código postal:</label>
          <input v-model="form.direccion.codigoPostal" type="text" />
        </div>
        <div>
          <label>Estado/provincia/zona:</label>
          <input v-model="form.direccion.estado" type="text" />
        </div>
        <div>
          <label>Entre calles:</label>
          <input v-model="form.direccion.entreCalles" type="text" />
        </div>
      </div>
    </form>
  </div>

  <div class="boton-container">
    <button type="button" class="boton-reg" @click="confirmarRegistro">Registrar</button>
  </div>
</template>

<script>
export default {
  name: "RegistroUsuario",
  data() {
    return {
      form: {
        nombre: "",
        apellidos: "",
        contacto: "",
        tipoUsuario: "Administrador",
        usuario: "",
        direccion: {
          calle: "",
          ciudad: "",
          codigoPostal: "",
          estado: "",
          entreCalles: "",
        },
      },
    };
  },
  methods: {
    registrarUsuario() {
      console.log("Datos enviados:", this.form);
      alert("Usuario registrado correctamente (simulado)");
    },
  },
};
</script>

<script setup>
import Swal from "sweetalert2";

function confirmarRegistro() {
  Swal.fire({
    title: "¿Desea registrar este Local?",
    text: "...",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FFF07F",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Sí, registrar Local!",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "swal2-popup-black",
      title: "swal2-title-black",
      content: "swal2-content-black",
      confirmButton: "swal2-confirm-custom",
      cancelButton: "swal2-cancel-custom",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "¡Registrado con éxito!",
        text: "Usuario registrado con éxito",
        icon: "success",
      }).then(() => {
        document.getElementById("myform").submit();
      });
    }
  });
}
</script>

<style>
.swal2-confirm {
  color: black !important;
  background-color: #fff07f !important;
  border: none !important;
}

.swal2-cancel {
  color: black !important;
  background-color: #d33 !important;
  border: none !important;
}
</style>

<style scoped>
.registro-container {
  padding: 30px 20px;
  border-radius: 10px;
  max-width: 1000px;
  width: 90%;
  margin: auto;
  font-family: Arial, sans-serif;
  color: #2e2e2e;
  box-sizing: border-box;
}

h2 {
  margin-left: 60px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.form-row label {
  flex: 0 0 140px;
  min-width: 100px;
  font-weight: 600;
}

.form-row input,
.form-row select {
  flex: 1 1 auto;
  min-width: 150px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Cuadros contenedores */
.image-upload {
  display: flex;
  gap: 40px;
  margin-left: 50px;
  margin-top: 20px;
}

.imagen-placeholder {
  width: 100px;
  height: 100px;
  background-color: #ddd;
  border: 1px solid #aaa;
  flex-shrink: 0;
}

/* Títulos sobre los cuadros */
.placeholder-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.boton-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.boton-container button {
  padding: 10px 20px;
  background-color: #9e5700;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 40px;
}

h3 {
  margin-top: 20px;
  font-size: 1.25rem;
}

.direccion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.direccion-grid label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.direccion-grid input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.swal2-popup-black {
  color: black !important;
}

.swal2-title-black {
  color: black !important;
}

.swal2-content-black {
  color: black !important;
}

/* Responsive */
@media (max-width: 600px) {
  .registro-container {
    padding: 20px 15px;
    width: 95%;
  }
  .form-row {
    flex-direction: column;
    align-items: stretch;
  }
  .form-row label {
    flex: none;
    margin-bottom: 5px;
  }
  .form-row input,
  .form-row select {
    min-width: 100%;
  }
  button {
    width: 100%;
    text-align: center;
    margin-right: 40px;
  }
  .image-upload {
    flex-direction: column;
    align-items: center;
  }
}
</style>
