<template>
<br>
    <h2>Registrar Sabores</h2>
    <div class="form-row image-upload">
        <div class="imagen-placeholder"></div>
      </div>
      <div class="registro-container">
    <form @submit.prevent="registrarUsuario">
      <div class="direccion-grid">
        <div>
          <label>Sabor:</label>
          <input v-model="form.direccion.calle" type="text" />
        </div>
        <div>
          <label>Precio:</label>
          <input v-model="form.direccion.ciudad" type="text" />
        </div>
        <div>
          <label>Descripción:</label>
          <input v-model="form.direccion.codigoPostal" type="text" />
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
import Swal from 'sweetalert2'

function confirmarRegistro() {
 Swal.fire({
  title: '¿Desea registrar este Usuario?',
  text: '...',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#FFF07F',
  cancelButtonColor: '#d33',
  confirmButtonText: '¡Sí, registrar Usuario!',
  cancelButtonText: 'Cancelar',
  customClass: {
    popup: 'swal2-popup-black',
    title: 'swal2-title-black',
      content: 'swal2-content-black',
      confirmButton: 'swal2-confirm-custom',
      cancelButton: 'swal2-cancel-custom'   
  }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: '¡Registrado con éxito!',
        text: 'Usuario registrado con éxito',
        icon: 'success'
      }).then(() => {
        document.getElementById('myform').submit();
      });
    }
  });
}

</script>

<style>
.swal2-confirm {
  color: black !important;
  background-color: #FFF07F !important;
  border: none !important;
}

.swal2-cancel {
  color: black !important;
  background-color: #d33 !important;
  border: none !important;
}
</style>

<style scoped>
/* Contenedor principal del formulario de registro */
.registro-container {
  padding: 30px 20px; /* padding menos grande para móviles */
  border-radius: 10px;
  max-width: 1000px;
  width: 90%;
  margin: auto;
  font-family: Arial, sans-serif;
  color: #2e2e2e;
  box-sizing: border-box;
}


h2{
  margin-left: 60px;
}

/* Estilos generales para el formulario */
form {
  display: flex;
  flex-direction: column;
}

/* Fila de formulario que contiene etiqueta e input */
.form-row {
  display: flex;
  flex-wrap: wrap; /* Permite que se envuelva en pantallas pequeñas */
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

/* Ancho de etiquetas, adaptativo */
.form-row label {
  flex: 0 0 140px; /* fijo pero puede cambiar */
  min-width: 100px;
  font-weight: 600;
}

/* Inputs y selects ocupan espacio restante */
.form-row input,
.form-row select {
  flex: 1 1 auto;
  min-width: 150px; /* mínimo para no hacerse muy pequeños */
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Contenedor para carga de imágenes */
.image-upload {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-left: 50px;
}

/* Cuadro gris marcador de posición para imagen */
.imagen-placeholder {
  width: 100px;
  height: 100px;
  background-color: #ddd;
  border: 1px solid #aaa;
  flex-shrink: 0;
  margin-top: 50px; /* espacio para que quede más abajo dentro de su contenedor */
}

.boton-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Botones del formulario */
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

/* Diseño en lista vertical para campos de dirección */
.direccion-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

/* Cada contenedor de campo con margen inferior */
.direccion-grid > div {
  display: flex;
  flex-direction: column;
}

/* Etiquetas en la lista */
.direccion-grid label {
  margin-bottom: 6px;
  font-weight: 600;
}

/* Inputs en la lista */
.direccion-grid input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}


/* Media Queries para pantallas pequeñas */
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
