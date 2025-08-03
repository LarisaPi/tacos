<template>
  <div>
    <div class="conteiner">
      <div class="page-wrapper">
        <div class="card">
          <div class="image-container">
            <img src="../assets/img/taco.png" alt="inicio" class="inicio" />
          </div>

          <div class="form-container">
          <br>
            <h2 class="title">Registro</h2>

            <label class="label" for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              class="input"
            />

            <label class="label" for="password">Contraseña</label>
            <input id="password" type="password" placeholder="Contraseña" class="input" />

            <router-link to="/reg_usuario" class="button primary"> Ingresar </router-link>
            <div class="divider">
              <div class="line"></div>
              <span class="or-text">o</span>
              <div class="line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sabores",
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
}
.card {
  display: flex;
  flex-wrap: wrap;
  max-width: 80rem;
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 50px;
}
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 100px; /* Ajusta esto para bajar más o menos */
  background-color: #f0fdf4;
}

.image-container {
  width: 50%; /* más estrecho que 50% */
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inicio {
  max-width: 1000px; /* más razonable que 10px */
  width: 150%;
  height: auto;
  object-fit: contain;
}

.form-container {
  width: 50%;
  background-color: #22c55e;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 1.875rem;
  font-weight: bold;
  color: rgb(14, 14, 14);
  margin-bottom: 1.5rem;
  text-align: center;
}

.label {
  font-size: 0.875rem;
  color: rgb(2, 2, 2);
  margin-bottom: 0.25rem;
}

.input {
  padding: 0.75rem;
  border-radius: 9999px;
  width: 100%;
  margin-bottom: 1rem;
  border: none;
  outline: none;
}

.input::placeholder {
  color: #bbf7d0;
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: bold;
  transition: background-color 0.3s;
  margin-bottom: 1.5rem;
  border: none;
  cursor: pointer;
}
.primary {
  background-color: #eb8825;
  color: rgb(14, 14, 14);
  text-align: center;
  text-decoration: none;
}

.primary:hover {
  background-color: #e2962c;
}

.secondary {
  background-color: rgb(148, 97, 10);
  color: rgb(14, 14, 14);
}

.secondary:hover {
  background-color: #1f2937;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.line {
  border-top: 1px solid #86efac;
  width: 33%;
}

.or-text {
  margin: 0 0.5rem;
  font-size: 0.875rem;
  color: #d1fae5;
}

@media (max-width: 768px) {
  .card {
    flex-direction: column;
  }

  .image-container,
  .form-container {
    width: 100%;
  }

  .image-container {
    height: 200px;
  }
}
</style>
