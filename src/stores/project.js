import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 项目管理 Store
 * 管理静态项目列表
 */
export const useProjectStore = defineStore('project', () => {
  // --- State ---
  /** 所有项目列表 (静态配置) */
  const projects = ref([
    {
      id: 'camera-move',
      name: '3D 摄像机控制',
      path: '/designs/camera-move',
      thumbnail: 'https://placehold.co/600x400/9b59b6/white?text=3D+Camera+Control',
      description: '交互式的摄像机控制，用于控制针对当前构图来进行视角设置。',
      color: "#FFCDD2" // Added color for compatibility with existing design if needed, or we can rely on thumbnail
    },
    {
      id: 'sketch-edit',
      name: 'Sketch运镜意图识别',
      path: '/designs/sketch-edit',
      thumbnail: 'https://placehold.co/600x400/3498db/white?text=Sketch+to+CamMove',
      description: '利用sketch自由绘图的方式，来识别用户的运镜意图。',
      color: "#BBDEFB"
    },
    // 您可以在此处添加更多项目
  ])

  /**
   * 根据 ID 获取项目详情
   * @param {string} id 项目 ID
   * @returns {Object|undefined} 项目对象或 undefined
   */
  function getProjectById(id) {
    return projects.value.find(p => p.id === id)
  }

  return {
    projects,
    getProjectById,
  }
})
