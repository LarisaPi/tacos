import { createRouter, createWebHashHistory } from 'vue-router'
import Inicio from '../views/inicio.vue'
import Carrito from '../views/carrito.vue'
import Cotizar from '../views/cotizar.vue'
import Editar_Taco from '../views/edit_taco.vue'
import Editar_Usuario from '../views/edit_usuario.vue'
import Editar_Local from '../views/edit_local.vue'
import Estado from '../views/estado.vue'
import FormPedido from '../views/form_pedido.vue'
import Inicio_Sesion from '../views/inicio_sesion.vue'
import Locales from '../views/locales.vue'
import Pedidos from '../views/pedidos.vue'
import Perfil from '../views/perfil.vue'
import Registrar_Taco from '../views/reg_taco.vue'
import Registrar_Local from '../views/reg_local.vue'
import Sabores from '../views/sabores.vue'
import Usuario from '../views/usuario.vue'
import comentarios from '../views/comentarios.vue'
import reg_usuario from '../views/reg_usuario.vue'
import pedidos_pendientes from '../views/pedidos_pendientes.vue'


const routes = [
  { path: '/inicio', component: Inicio },
  { path: '/carrito', component: Carrito },
  { path: '/cotizar', component: Cotizar },
  { path: '/sabores', component: Sabores },
  { path: '/editar_taco', component: Editar_Taco },
 { 
  path: '/edit_usuario/:id', 
  name: 'EditUsuario',  // 👈 este nombre es el que usas en this.$router.push()
  component: Editar_Usuario, 
  props: true 
},
  { path: '/editar_local', component: Editar_Local },
  { path: '/estado', component: Estado },
  { path: '/form_pedido', component: FormPedido },
  { path: '/inicio_sesion', component: Inicio_Sesion },
  { path: '/locales', component: Locales },
  { path: '/pedidos', component: Pedidos },
 {
    path: '/perfil/:id',
    name: 'Perfil',
    component: Perfil,
    props: true
  },

  { path: '/registrar_taco', component: Registrar_Taco },
  { path: '/registrar_local', component: Registrar_Local },
  { path: '/usuario', component: Usuario },
  { path: '/comentarios', component: comentarios },
  { path: '/reg_usuario', component: reg_usuario },
  { path: '/pedidos_pendintes', component: pedidos_pendientes },
]

const router = createRouter({
  history: createWebHashHistory(), // 👈 este es el cambio clave
  routes,
})

export default router
