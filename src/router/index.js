import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CameraControl from '../views/CameraControl.vue'

const router = createRouter({
  // Use createWebHashHistory for simpler GitHub Pages deployment compatibility
  // unless you have configured 404.html redirection hack for history mode
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/gallery/3d-camera',
      name: '3d-camera',
      component: CameraControl
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

export default router
