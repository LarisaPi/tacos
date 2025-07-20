<template>
  <div class="contenedor">
    <h1>Editar Usuario</h1>

    <div class="fila">
      <div class="campo">
        <label>Nombre</label>
        <input type="text" v-model="form.nombre" placeholder="Escribe tu nombre..." />
      </div>
      <div class="campo">
        <label>Apellidos</label>
        <input
          type="text"
          v-model="form.apellidos"
          placeholder="Escribe tus apellidos..."
        />
      </div>
    </div>

    <div class="fila">
      <div class="campo">
        <label>Correo electrónico</label>
        <input
          type="email"
          v-model="form.correo_electronico"
          placeholder="Escribe tu correo electrónico..."
        />
      </div>
      <div class="campo">
        <label>Nueva Contraseña</label>
        <input
          type="password"
          v-model="form.contrasena"
          placeholder="Escribe la contraseña..."
        />
      </div>
    </div>

    <div class="fila">
      <div class="campo">
        <label>Contacto</label>
        <input
          type="text"
          v-model="form.contacto"
          placeholder="Escribe tu número o correo..."
        />
      </div>
      <div class="campo">
        <label>Imagen</label>
        <input
          type="file"
          id="imagen"
          @change="onFileChange"
          accept="image/*"
          class="file-input"
        />
      </div>
    </div>

    <h3 class="subtitulo">Dirección</h3>

    <div class="fila">
      <div class="campo">
        <label>Calle</label>
        <input type="text" v-model="form.direccion.calle" />
      </div>
      <div class="campo">
        <label>Ciudad</label>
        <input type="text" v-model="form.direccion.ciudad" />
      </div>
    </div>

    <div class="fila">
      <div class="campo">
        <label>Código Postal</label>
        <input type="text" v-model="form.direccion.codigo_postal" />
      </div>
      <div class="campo">
        <label>Estado / Provincia / Zona</label>
        <input type="text" v-model="form.direccion.estado_provincia_zona" />
      </div>
    </div>

    <div class="fila">
      <div class="campo campo-grande">
        <label>Entre calles</label>
        <input type="text" v-model="form.direccion.entre_calles" />
      </div>
      <div class="preview" v-if="previewUrl">
        <img :src="previewUrl" alt="Vista previa" />
      </div>
    </div>

    <div class="botones">
      <button class="editar" @click="guardarCambios">Guardar</button>
      <button class="eliminar" @click="eliminarUsuario">Eliminar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const form = reactive({
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
  foto_perfil: "",
});

const contrasenaOriginal = ref(""); // nueva variable para mantener la contraseña real

const previewUrl = ref(null);
let objectUrl = null;
let archivoSeleccionado = null;

onMounted(async () => {
  const id = route.params.id;
  console.log("ID recibido para editar:", id);

  try {
    const res = await fetch(`http://localhost:3000/api/usuarios/${id}`);
    if (!res.ok) throw new Error("Error al obtener datos");

    const data = await res.json();
    console.log("Datos recibidos:", data);

    form.nombre = data.nombre || "";
    form.apellidos = data.apellidos || "";
    form.contacto = data.contacto || "";
    form.tipo_usuario = data.tipo_usuario || "";
    form.correo_electronico = data.correo_electronico || "";
    form.contrasena = ""; // el input queda vacío
    contrasenaOriginal.value = data.contrasena || ""; // pero se guarda aparte

    if (data.direccion) {
      form.direccion.calle = data.direccion.calle || "";
      form.direccion.ciudad = data.direccion.ciudad || "";
      form.direccion.codigo_postal = data.direccion.codigo_postal || "";
      form.direccion.estado_provincia_zona = data.direccion.estado_provincia_zona || "";
      form.direccion.entre_calles = data.direccion.entre_calles || "";
    } else {
      form.direccion.calle = data.calle || "";
      form.direccion.ciudad = data.ciudad || "";
      form.direccion.codigo_postal = data.codigo_postal || "";
      form.direccion.estado_provincia_zona = data.estado_provincia_zona || "";
      form.direccion.entre_calles = data.entre_calles || "";
    }

    form.foto_perfil = data.foto_perfil || "";
    previewUrl.value = data.foto_perfil || null;
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo cargar la información del usuario.", "error");
  }
});

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    previewUrl.value = objectUrl;
    archivoSeleccionado = file;
  } else {
    previewUrl.value = null;
    archivoSeleccionado = null;
    Swal.fire("Error", "Por favor selecciona una imagen válida.", "error");
  }
};

onBeforeUnmount(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
});

const convertirArchivoABase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Error al convertir imagen");
    reader.readAsDataURL(file);
  });
};

const guardarCambios = async () => {
  try {
    const id = route.params.id;

    let foto = form.foto_perfil;
    if (archivoSeleccionado) {
      foto = await convertirArchivoABase64(archivoSeleccionado);
    }

    // si el campo está vacío, se envía la contraseña original
    const contrasenaFinal = form.contrasena.trim()
      ? form.contrasena
      : contrasenaOriginal.value;

    const usuarioActualizado = {
      nombre: form.nombre,
      apellidos: form.apellidos,
      contacto: form.contacto,
      tipo_usuario: form.tipo_usuario,
      correo_electronico: form.correo_electronico,
      calle: form.direccion.calle,
      ciudad: form.direccion.ciudad,
      codigo_postal: form.direccion.codigo_postal,
      estado_provincia_zona: form.direccion.estado_provincia_zona,
      entre_calles: form.direccion.entre_calles,
      foto_perfil: foto,
      contrasena: contrasenaFinal,
    };

    const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioActualizado),
    });

    if (!res.ok) throw new Error("Error al actualizar");

    Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
    router.push("/perfil");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
  }
};

const eliminarUsuario = () => {
  Swal.fire({
    title: "¿Seguro que quieres eliminar?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const id = route.params.id;
        const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Error al eliminar");

        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
        router.push("/inicio_sesion");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  });
};
</script>

<style scoped>
.contenedor {
  max-width: 1000px;
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
}

.subtitulo {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 20px;
  text-align: center;
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
input[type="file"],
input[type="email"],
input[type="password"] {
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  justify-content: center;
  margin-top: 30px;
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
    flex-direction: column;
    gap: 12px;
  }
}
</style>
