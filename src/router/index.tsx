import { createHashRouter } from 'react-router-dom'
import App from '../App'
import HomeView from '../views/HomeView'
import LifeView from '../views/LifeView'

/**
 * 用 hash 路由（#/）以兼容 GitHub Pages 静态部署。
 * App 作为布局壳，子路由渲染进 <Outlet />。
 */
const router = createHashRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomeView /> },
      { path: '/life', element: <LifeView /> },
      // 兜底：任何未知路径回首页
      { path: '*', element: <HomeView /> },
    ],
  },
])

export default router
