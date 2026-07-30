import { createHashRouter } from 'react-router-dom'
import App from '../App'
import HomeView from '../views/HomeView'
import LifeView from '../views/LifeView'
import GadgetsView from '../views/GadgetsView'
import { ROUTES } from '../config/site'

/**
 * 用 hash 路由（#/）以兼容 GitHub Pages 静态部署。
 * App 作为布局壳，子路由渲染进 <Outlet />。
 */
const router = createHashRouter([
  {
    element: <App />,
    children: [
      { path: ROUTES.home, element: <HomeView /> },
      { path: ROUTES.life, element: <LifeView /> },
      { path: ROUTES.gadgets, element: <GadgetsView /> },
      // 兜底：任何未知路径回首页
      { path: ROUTES.fallback, element: <HomeView /> },
    ],
  },
])

export default router
