// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

// Views
import Inicio           from '../views/inicio.vue'
import Carrito          from '../views/carrito.vue'
import Cotizar          from '../views/cotizar.vue'
import Sabores          from '../views/sabores.vue'
import Locales          from '../views/locales.vue'
import InicioSesion     from '../views/inicio_sesion.vue'
import FormPedido       from '../views/form_pedido.vue'
import EstadoPedidos    from '../views/estado.vue'
import Pago             from '../views/pago.vue'
import Perfil           from '../views/perfil.vue'
import Pedidos          from '../views/pedidos.vue'
import TablaPedidos     from '../views/tabla_pedidos.vue'
import Usuario          from '../views/usuario.vue'
import Comentarios      from '../views/comentarios.vue'

// Edit / Register
import EditarTaco       from '../views/edit_taco.vue'
import EditarUsuario    from '../views/edit_usuario.vue'
import EditarLocal      from '../views/edit_local.vue'
import EditarInicio     from '../views/editar_inicio.vue'

import RegistrarTaco    from '../views/reg_taco.vue'
import RegistrarLocal   from '../views/reg_local.vue'
import RegUsuario       from '../views/reg_usuario.vue'
import Registro         from '../views/registro.vue'

const routes = [
  // Redirección raíz
  { path: '/', redirect: '/inicio' },

  // Pantalla de inicio con rol opcional
  {
    path: '/inicio/:rol?',
    name: 'Inicio',
    component: Inicio,
    props: route => ({ rolUsuario: route.params.rol })
  },

  // Pago con query string
  {
  path: '/pago',
  name: 'Pago',
  component: Pago,
  props: true,
  meta: { requiresAuth: true } // Puedes agregar also `onlyAdmin: true` si deseas proteger toda la vista
},


  // Rutas generales
  { path: '/carrito',     name: 'Carrito',      component: Carrito },
  { path: '/cotizar',     name: 'Cotizar',      component: Cotizar },
  {
    path: '/sabores/:rol?',
    name: 'Sabores',
    component: Sabores,
    props: route => ({ rolUsuario: route.params.rol })
  },

  // CRUD Tacos
  {
    path: '/editar-taco/:id',
    name: 'EditarTaco',
    component: EditarTaco,
    props: true
  },
  { path: '/registrar_taco', name: 'RegistrarTaco', component: RegistrarTaco },

  // Usuarios
  {
    path: '/edit_usuario/:id',
    name: 'EditarUsuario',
    component: EditarUsuario,
    props: true
  },
{
  path: '/reg_usuario/:rol?',
  name: 'RegUsuario',
  component: RegUsuario,
  props: route => ({ rolUsuario: route.params.rol })
},

  { path: '/registro',      name: 'Registro',      component: Registro },

  // Locales
  {
    path: '/editar-local/:id',
    name: 'EditarLocal',
    component: EditarLocal,
    props: true
  },
  {
    path: '/locales/:rol?',
    name: 'Locales',
    component: Locales,
    props: route => ({ rolUsuario: route.params.rol })
  },
  {
    path: '/locales/:id/comentarios',
    name: 'ComentariosLocal',
    component: Comentarios,
    props: route => ({ localId: Number(route.params.id) })
  },
  { path: '/registrar_local', name: 'RegistrarLocal', component: RegistrarLocal },

  // Sesión y pedidos
  { path: '/inicio_sesion', name: 'InicioSesion', component: InicioSesion },
  {
    path: '/form_pedido/:id',
    name: 'FormPedido',
    component: FormPedido,
    props: true,
    meta: { requiresAuth: true }
  },

  { path: '/estado',        name: 'EstadoPedidos', component: EstadoPedidos },

  // Perfil y seguimiento de pedidos
  {
    path: '/perfil/:id',
    name: 'Perfil',
    component: Perfil,
    props: true
  },
  { path: '/pedidos',    name: 'Pedidos',     component: Pedidos },

  // Cliente & Admin
  {
    path: '/tabla_pedidos/:rol/:id',
    name: 'TablaPedidos-Simple',
    component: TablaPedidos,
    props: true
  },
  // Vendedor (nombre opcional)
  {
    path: '/tabla_pedidos/:rol/:id/:nombre',
    name: 'TablaPedidos-ConNombre',
    component: TablaPedidos,
    props: true
  },


  // Otras
  { path: '/usuario', name: 'Usuario', component: Usuario },
  {
    path: '/editar-inicio',
    name: 'EditarInicio',
    component: EditarInicio
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard global
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    let user = null
    try {
      user = JSON.parse(localStorage.getItem('currentUser'))
    } catch {}
    if (!user || !user.id) {
      return next({
        name: 'InicioSesion',
        query: { redirect: to.fullPath }
      })
    }
  }
  next()
})

export default router
