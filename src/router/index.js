import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CreateWaifu from '../views/CreateWaifu.vue'
import EditWaifu from '../views/EditWaifu'
import Franchises from '../views/Franchises'
import WaifuTypes from '../views/WaifuTypes'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create-waifu',
    name: 'Create Waifu',
    component: CreateWaifu
  },
  {
    path: '/edit-waifu/:id',
    name: 'Edit Waifu',
    component: EditWaifu
  },
  {
    path: '/franchises',
    name: 'Franchises',
    component: Franchises
  },
  {
    path: '/waifu-types',
    name: 'Waifu Types',
    component: WaifuTypes
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
