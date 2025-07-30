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
import Comentarios from '../views/comentarios.vue'
import Reg_Usuario from '../views/reg_usuario.vue'
import Edit_Inicio from '../views/editar_inicio.vue'
import Pago from '../views/pago.vue'
import Tabla_Pedidos from '../views/tabla_pedidos.vue'

const routes = [
   {
  path: "/inicio/:rol?",
  name: "Inicio",
  component: Inicio,
  props: route => ({ rolUsuario: route.params.rol })
},

  {
    path: '/pago',
    name: 'Pago',
    component: Pago,
    props: route => ({
      order: route.query.order ? JSON.parse(route.query.order) : null
    })
  },

  { path: '/carrito', component: Carrito },
  { path: '/cotizar', component: Cotizar },
  {  path: "/sabores/:rol?",
  name: "Sabores",
  component: Sabores,
  props: route => ({ rolUsuario: route.params.rol })
   },
 { path: '/editar-taco/:id', component: Editar_Taco, props: true },
  {
    path: '/edit_usuario/:id',
    name: 'EditUsuario',
    component: Editar_Usuario,
    props: true
  },
{ path: '/editar-local/:id', name: 'EditLocal', component: Editar_Local, props: true },
  { path: '/estado', component: Estado },
  { path: '/form_pedido', component: FormPedido },
  { path: '/inicio_sesion', component: Inicio_Sesion },
  {  path: "/locales/:rol?",
  name: "Locales",
  component: Locales,
  props: route => ({ rolUsuario: route.params.rol })
   },
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
  { path: '/comentarios', component: Comentarios },
  { path: '/reg_usuario', component: Reg_Usuario },
  { path: '/editar_inicio', component: Edit_Inicio },
  { path: '/tabla_pedidos', component: Tabla_Pedidos },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
