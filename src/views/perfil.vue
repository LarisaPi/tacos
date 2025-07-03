<template>
  <div class="perfil-container">
    <!-- Encabezado de usuario -->
    <div class="perfil-header">
      <div class="imagen-usuario">JU</div>
      <div class="usuario-info">
        <h3>{{ usuario.nombre }} {{ usuario.apellido }}</h3>
        
        <p class="email">{{ usuario.contacto }}</p>
      </div>
    </div>

    <p class="info-aviso">Tu perfil está sincronizado con tu cuenta del local.</p>

    <!-- Lista de opciones -->
    <div class="perfil-opciones">
      <div class="opcion" @click="reg_usuario">
        <i class="icon">➕👤</i>
        <div>
          <p class="titulo">Registrar usuarios</p>
          <p class="descripcion">Añadir nuevos usuarios a la base.</p>
        </div>
      </div>

<div class="opcion" @click="reg_taco">
        <i class="icon">➕🌮</i>
        <div>
          <p class="titulo">Registrar sabores</p>
          <p class="descripcion">Añadir nuevos sabores a la base.</p>
        </div>
      </div>

      <div class="opcion" @click="edit_usuario">
        <i class="icon">✏️👤</i>
        <div>
          <p class="titulo">Editar Usuario</p>
          <p class="descripcion">Edita tus datos</p>
        </div>
      </div>

      <div class="opcion" @click="edit_taco">
        <i class="icon">✏️🌮</i>
        <div>
          <p class="titulo">Editar sabor</p>
          <p class="descripcion">Edita tus datos</p>
        </div>
      </div>

      <div class="opcion" @click="estado">
        <i class="icon">☺️=🥳</i>
        <div>
          <p class="titulo">Estado de pedido</p>
          <p class="descripcion">Ver el estado de tu pedido.</p>
        </div>
      </div>

    <div class="opcion" @click="verUsuarios">
        <i class="icon">👤👀</i>
        <div>
          <p class="titulo">Usuarios</p>
          <p class="descripcion">Ver usuarios.</p>
        </div>
      </div>

      <div class="opcion" @click="pedidosAleatorios">
        <i class="icon">🔄</i>
        <div>
          <p class="titulo">Pedidos aleatorios</p>
          <p class="descripcion">Generar pedidos de prueba.</p>
        </div>
      </div>
      <div class="opcion" @click="registrarLocal">
        <i class="icon">🏪</i>
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
  data() {
    return {
      usuario: {
        nombre: 'Juan',
        apellido: 'Perez',
        direccion: 'Calle Gustavo, #12, Xicotencatl, Tlaxcala',
        contacto: 'juanperez@gmail.com',
        local: 'Tacos de canasta El Juan'
      }
    };
  },
  methods: {
    cotizador() {this.$router.push('/cotizar');},
    reg_usuario(){ 
      this.$router.push('/reg_usuario'); // Navega a la ruta que ya definiste
    },
    edit_usuario() {this.$router.push('/edit_usuario');},

    edit_taco(){this.$router.push('/edit_taco');},
    reg_taco() {
      this.$router.push('/reg_taco'); 
    },
    verUsuarios() {
    this.$router.push('/usuario');
  },
    estado(){this.$router.push('/estado');},
    pedidosAleatorios() {this.$router.push('/form_pedido');},
    registrarLocal() {this.$router.push('/reg_local');},
    cerrarSesion() {}
  }
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
}

.usuario-info h3 {
  margin: 0;
}

.email {
  color: #666;
  font-size: 14px;
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
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.opcion:hover {
  background-color: #eee;
}

.icon {
  font-size: 24px;
}

.titulo {
  font-weight: bold;
  margin: 0;
}

.descripcion {
  font-size: 13px;
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
}
</style>
