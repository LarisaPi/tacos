<template>
  <div class="page">
    <h1 class="title">Sabor que no se olvida</h1>

    <section class="intro-section">
      <h2 class="section-title">Chiquihuitl Tacos</h2>
      <img
        src="../assets/img/tacostlaxcala.png"
        alt="Grupo con tacos de canasta"
        class="main-image"
      />
      <p class="section-text">
        En Chiquihuitl Tacos llevamos la tradición en alto: ganadores del Récord Guinness
        por nuestros 186 sabores de tacos de canasta. Cada taco es una muestra del sabor
        de México, hecho con historia, cariño y orgullo nacional. Desde los clásicos de
        siempre hasta combinaciones únicas, cada bocado es un homenaje a nuestras raíces y
        a la creatividad que nos distingue.
      </p>
    </section>

    <section class="gallery">
      <div class="image-block">
        <img src="../assets/img/repartocansta.png" alt="Tacos cerca" />
        <p>
          Una canasta, cientos de historias Cada uno de nuestros 186 sabores cuenta una
          historia: de familia, de calle, de barrio, de México. En cada mordida viajas a
          diferentes rincones del país sin salir de tu mesa.
        </p>
      </div>
      <div class="image-block">
        <img src="../assets/img/tacosalsa.jpg" alt="Taco verde" />
        <p>
          ¡Somos historia y sabor en una canasta! Chiquihuitl Tacos fue reconocido con el
          Récord Guinness por lograr 186 sabores diferentes de tacos de canasta. Un logro
          que no solo nos llena de orgullo, sino que representa el corazón de la
          gastronomía mexicana.
        </p>
      </div>
      <div class="image-block">
        <img src="../assets/img/tacospapa.jpg" alt="Feria de tacos" />
        <p>
          El alma en una canasta “Chiquihuitl” significa canasta en náhuatl. Y para
          nosotros, es más que un nombre: es el símbolo que guarda el calor, el sabor y la
          tradición de nuestra cocina. Así nace cada taco: del alma a tu paladar.
        </p>
      </div>
      <div class="image-block">
        <img src="../assets/img/tacosplato.png" alt="Tacos dorados" />
        <p>
          El alma en una canasta “Chiquihuitl” significa canasta en náhuatl. Y para
          nosotros, es más que un nombre: es el símbolo que guarda el calor, el sabor y la
          tradición de nuestra cocina. Así nace cada taco: del alma a tu paladar.
        </p>
      </div>
      <div class="image-block">
        <img src="../assets/img/entrega.png" alt="Entrega de tacos" />
        <p>
          Tacos sudaditos, directo a tu antojo No importa si estás en casa, en la oficina
          o en la calle. Nuestro sabor viaja contigo. Pide tus favoritos y descubre por
          qué somos los tacos de canasta más variados del mundo.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Sabores",
};
</script>

<style scoped>
.page {
  background-color: white; /* rosa claro */
  padding: 16px;
  font-family: "Arial", sans-serif;
}

.title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  background-color: #fbd2c9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.intro-section {
  background-color: #f7b998;
  padding: 20px;
  border-radius: 10px;
  color: rgb(15, 15, 15);
  margin-bottom: 24px;
}

.section-title {
  text-align: center;
  font-size: 1.8rem;
  color: #0f0e0e;
  margin-bottom: 16px;
  font-weight: bold;
}

.subtitle {
  font-size: 1.5rem;
  color: #b3340b;
  margin-bottom: 10px;
}

.section {
  background-color: #e96e42;
  padding: 16px;
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  max-width: 600px; /* o el ancho real de la imagen */
  margin-bottom: 10px;
  border-radius: 8px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.image-block {
  text-align: center;
  background-color: #f7b998;
  padding: 10px;
  border-radius: 8px;
}

.image-block img {
  width: 100%;
  max-width: 400px; /* Ajusta según tu diseño */
  height: auto; /* Mantiene proporción */
  border-radius: 6px;
  margin-bottom: 6px;
  image-rendering: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.image-block p {
  font-size: 0.9rem;
  color: #333;
}
section-title {
  color: black;
}
</style>
