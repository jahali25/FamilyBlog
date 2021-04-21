import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'
import AddPost from '../views/AddPost.vue'
import Exhibition from '../views/Exhibition.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/addPost',
    name: 'AddPost',
    component: AddPost
  },
  {
    path: '/exhibition',
    name: 'Exhibition',
    component: Exhibition
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
