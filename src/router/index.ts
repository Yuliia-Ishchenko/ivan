import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Login from '@/views/Login.vue'
import Import from '@/views/Import.vue'
import TestLocation from '@/views/TestLocation.vue'
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Import',
    component: Import
  },
  {
    path: '/testlocation',
    name: 'TestLocation',
    component: TestLocation
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,

  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach(async (to, from, next) => {
//   if(store.getters.getAuthStatus || to.name === 'Login'){
//     next()
//   }
//   else{
//     next({ name: 'Login' })
//     return { name: 'Login' }
//   }
// })

export default router
