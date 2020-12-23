import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import CreateWaifu from '../views/CreateWaifu'
import EditWaifu from '../views/EditWaifu'
import Franchises from '../views/Franchises'
import WaifuTypes from '../views/WaifuTypes'
import Special from '../views/Special'
import CreateSpecial from '../views/CreateSpecial'
import EditSpecial from '../views/EditSpecial'

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
  },
  {
    path: '/special',
    name: 'Special',
    component: Special
  },
  {
    path: '/special/create',
    name: 'Create Special',
    component: CreateSpecial
  },
  {
    path: '/special/:id',
    name: 'Edit Special',
    component: EditSpecial
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
