import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '../views/inicio.vue'
import Carrito from '../views/carrito.vue'
import Cotizar from '../views/cotizar.vue'
import Editar_Taco from '../views/edit_taco.vue'
import Editar_Usuario from '../views/edit_usuario.vue'
import Estado from '../views/estado.vue'
import FormPedido from '../views/form_pedido.vue'
import Inicio_Sesion from '../views/inicio_sesion.vue'
import Locales from '../views/locales.vue'
import Pedidos from '../views/pedidos.vue'
import Perfil from '../views/perfil.vue'
import Reg_Taco from '../views/reg_taco.vue'
import Reg_Usuario from '../views/reg_usuario.vue'
import Registro from '../views/registro.vue'
import Sabores from '../views/sabores.vue'
import Usuario from '../views/usuario.vue'
import reg_local from '../views/reg_local.vue'

const routes = [
  { path: '/inicio', component: Inicio },
  { path: '/carrito', component: Carrito },
  { path: '/cotizar', component: Cotizar },
  { path: '/sabores', component: Sabores },
  { path: '/editar_taco', component: Editar_Taco },
  { path: '/editar_usuario', component: Editar_Usuario },
  { path: '/estado', component: Estado },
  { path: '/form_pedido', component: FormPedido },
  { path: '/inicio_sesion', component: Inicio_Sesion },
  { path: '/locales', component: Locales },
  { path: '/pedidos', component: Pedidos },
  { path: '/perfil', component: Perfil },
  { path: '/reg_taco', component: Reg_Taco },
  { path: '/reg_usuario', component: Reg_Usuario },
  { path: '/registro', component: Registro },
  { path: '/usuario', component: Usuario },
  { path: '/reg_local', component: reg_local },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
