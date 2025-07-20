<template>
  <div class="perfil-container">
    <!-- Encabezado de usuario -->
    <div class="perfil-header">
      <div class="imagen-usuario">{{ iniciales }}</div>
      <div class="usuario-info">
        <h3>{{ usuario.nombre }} {{ usuario.apellidos }}</h3>
        <p class="email">{{ usuario.contacto }}</p>
        <p class="rol">Rol: {{ usuario.tipo_usuario }}</p>
      </div>
    </div>

    <p class="info-aviso">Tu perfil está sincronizado con tu cuenta del local.</p>

    <!-- Lista de opciones -->
    <div class="perfil-opciones">
      <!-- Registrar usuarios - solo admin -->
      <div
        class="opcion"
        @click="registrarUsuario"
        v-if="usuario.tipo_usuario === 'admin'"
      >
        <i class="icon">🆕👤</i>
        <div>
          <p class="titulo">Registrar usuarios</p>
          <p class="descripcion">Añadir nuevos usuarios a la base.</p>
        </div>
      </div>

      <!-- Editar - todos -->
      <div class="opcion" @click="edit_usuario">
        <i class="icon">📝👤</i>
        <div>
          <p class="titulo">Editar</p>
          <p class="descripcion">Edita tus datos.</p>
        </div>
      </div>

      <!-- Registrar sabores - admin y vendedor -->
      <div class="opcion" @click="reg_taco" v-if="usuario.tipo_usuario !== 'cliente'">
        <i class="icon">➕🌮</i>
        <div>
          <p class="titulo">Registrar sabores</p>
          <p class="descripcion">Añadir nuevos sabores a la base.</p>
        </div>
      </div>

      <!-- Estado de pedido - cliente y admin y vendedor -->
      <div class="opcion" @click="estado">
        <i class="icon">📦✅</i>
        <div>
          <p class="titulo">Estado de pedido</p>
          <p class="descripcion">Ver el estado de tu pedido.</p>
        </div>
      </div>

      <!-- Ver usuarios - solo admin -->
      <div class="opcion" @click="verUsuarios" v-if="usuario.tipo_usuario === 'admin'">
        <i class="icon">👥🔍</i>
        <div>
          <p class="titulo">Usuarios</p>
          <p class="descripcion">Ver usuarios.</p>
        </div>
      </div>

      <!-- Pedidos aleatorios - solo admin -->
      <div
        class="opcion"
        @click="pedidosAleatorios"
        v-if="usuario.tipo_usuario === 'admin'"
      >
        <i class="icon">🎲🧾</i>
        <div>
          <p class="titulo">Pedidos aleatorios</p>
          <p class="descripcion">Generar pedidos de prueba.</p>
        </div>
      </div>

      <!-- Registrar local - admin y vendedor -->
      <div
        class="opcion"
        @click="registrarLocal"
        v-if="usuario.tipo_usuario !== 'cliente'"
      >
        <i class="icon">🏪📝</i>
        <div>
          <p class="titulo">Registrar local</p>
          <p class="descripcion">Añadir información del establecimiento.</p>
        </div>
      </div>
    </div>

    <!-- Botón de cerrar sesión -->
    <button class="cerrar" @click="cerrarSesion">Cerrar sesión</button>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      usuario: {},
    };
  },
  computed: {
    iniciales() {
      if (!this.usuario.nombre) return "";
      const nombres = this.usuario.nombre.split(" ");
      const apellidos = this.usuario.apellidos ? this.usuario.apellidos.split(" ") : [];
      const inicialNombre = nombres[0] ? nombres[0][0].toUpperCase() : "";
      const inicialApellido = apellidos[0] ? apellidos[0][0].toUpperCase() : "";
      return inicialNombre + inicialApellido;
    },
  },
  mounted() {
    // Aquí usamos this.id (prop)
    fetch(`http://localhost:3000/api/usuarios/${this.id}`)
      .then(function (res) {
        if (!res.ok) throw new Error("Usuario no encontrado");
        return res.json();
      })
      .then((data) => {
        this.usuario = data;
      })
      .catch((error) => {
        console.error("Error al cargar usuario:", error);
        alert("No se pudo cargar la información del usuario.");
      });
  },
  methods: {
    registrarUsuario() {
      this.$router.push("/reg_usuario");
    },
    edit_usuario() {
      // Navegar con nombre de ruta y param id
      this.$router.push({ name: "EditUsuario", params: { id: this.id } });
    },
    reg_taco() {
      this.$router.push("/registrar_taco");
    },
    comentarios() {
      this.$router.push("/comentarios");
    },
    edit_taco() {
      this.$router.push("/editar_taco");
    },
    estado() {
      this.$router.push("/estado");
    },
    verUsuarios() {
      this.$router.push("/usuario");
    },
    pedidosAleatorios() {
      this.$router.push("/pedidos");
    },
    registrarLocal() {
      this.$router.push("/registrar_local");
    },
    cerrarSesion() {
      this.$router.push("/inicio_sesion");
    },
  },
};
</script>

<style scoped>
.perfil-container {
  background-color: #fff;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

.perfil-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.imagen-usuario {
  width: 60px;
  height: 60px;
  background-color: #ddd;
  border-radius: 50%;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.usuario-info h3 {
  margin: 0;
}

.email {
  color: #666;
  font-size: 14px;
  margin: 4px 0;
}

.info-aviso {
  background-color: #f0f0f0;
  padding: 10px;
  font-size: 13px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.perfil-opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opcion {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px; /* Espacio */
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  min-height: 70px; /*  Altura  */
}

.opcion:hover {
  background-color: #eee;
}

.icon {
  font-size: 24px;
  width: 35px; /* mantener alineación */
  text-align: center;
  flex-shrink: 0;
}

.opcion > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; /* texto a la izquierda */
  flex: 1;
}

.titulo {
  font-weight: bold;
  margin: 0;
  font-size: 20px;
  color: #222;
}

.descripcion {
  font-size: 16px;
  margin: 0;
  color: #666;
}

.cerrar {
  margin-top: 20px;
  background-color: #d9534f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  font-weight: 600;
  transition: background 0.3s ease;
  width: auto;
}

.cerrar:hover {
  background-color: #c9302c;
}

.nombre-completo {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #222;
}

.rol {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

/* 📱 Mejor responsividad de textos y contenedores */
.titulo,
.descripcion,
.email,
.rol {
  word-break: break-word;
  max-width: 100%;
  text-align: left;
  font-size: clamp(14px, 2vw, 18px);
}

.usuario-info {
  flex: 1;
  min-width: 220px;
  flex-wrap: wrap;
  text-align: left;
}

.usuario-info h3 {
  font-size: clamp(16px, 3vw, 22px);
  margin: 0;
}

/* Tablet */
@media (max-width: 768px) {
  .usuario-info h3 {
    font-size: clamp(16px, 4vw, 18px);
  }

  .email,
  .rol {
    font-size: clamp(12px, 3vw, 14px);
  }

  .perfil-opciones {
    flex-direction: column;
    gap: 14px;
  }

  .opcion > div {
    align-items: flex-start;
  }
}

/* Móvil */
@media (max-width: 480px) {
  .perfil-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    text-align: left;
  }

  .usuario-info {
    text-align: left;
  }

  .opcion {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 10px 16px;
    gap: 16px;
  }

  .icon {
    font-size: 20px;
    min-width: 36px;
    flex-shrink: 0;
    text-align: center;
  }

  .opcion > div {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    text-align: left;
    word-break: break-word;
  }

  .titulo {
    font-size: 15px;
    margin-bottom: 4px;
  }

  .descripcion {
    font-size: 13px;
  }

  .cerrar {
    font-size: 14px;
    padding: 10px;
    width: 100%;
    max-width: 250px;
  }
}
</style>
