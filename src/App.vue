<script setup>

</script>

<template>
  <div class="container">
    <nav class="nav-links">
    <router-link to="/inicio">Inicio</router-link>
    <router-link to="/sabores">Sabores</router-link>
    <router-link to="/cotizar">Cotizar</router-link>
    <router-link to="/locales">Locales</router-link>
    <router-link to="/inicio_sesion">Inicio de sesion</router-link>
    <router-link to="/carrito"><img src="./assets/img/carrito.png" alt="carrito" class="carrito"></router-link>
  </nav>
  </div>
  <main class="content">
    <router-view />
  </main>
</template>

<style>
.content {
  padding-top: 90px;
}

.carrito {
  background-size: cover;
  width: 80px;
  height: 60px;
  object-fit: contain;
}

.container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 90px;
  background: #D2782AFF;
  box-shadow: 0px 4px 9px #d2782a1C, 0px 0px 2px #d2782a1F;
  padding-right: 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  display: flex;
  align-items: center;
  height: 90px;
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
}


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
}

</style>