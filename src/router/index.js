import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CameraControl from '../views/designs/CameraControl.vue'
import SketchEdit from '../views/designs/SketchEdit.vue'
import AniMaster from '../views/designs/AniMaster.vue'
import FreshmanSurvey from '../views/designs/FreshmanSurvey.vue'
import MontagePlanningSimulator from '../views/designs/MontagePlanningSimulator.vue'
import Storyline from '../views/designs/Storyline.vue'

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
      path: '/designs/camera-move',
      name: 'camera-move',
      component: CameraControl
    },
    {
      path: '/designs/sketch-edit',
      name: 'sketch-edit',
      component: SketchEdit
    },
    {
      path: '/designs/animaster',
      name: 'animaster',
      component: AniMaster
    },
    {
      path: '/designs/freshman',
      name: 'freshman',
      component: FreshmanSurvey
    },
    {
      path: '/designs/MontagePlanningSimulator',
      name: 'new-project',
      component: MontagePlanningSimulator
    },
    {
      path: '/designs/storyline',
      name: 'storyline',
      component: Storyline
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
