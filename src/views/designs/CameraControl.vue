<template> 
   <div class="camera-move-container"> 
     <div class="controls-overlay"> 
       <el-button @click="$router.push('/')" size="small">Back</el-button> 
       <div class="info-panel"> 
         <h3>3D Camera Control</h3> 
         <p>1. Drag 🟢 Green Handle to rotate horizontally (Azimuth) & Distance</p> 
         <p>2. Drag 🌸 Pink Handle to adjust height (Elevation)</p> 
         <div class="values"> 
           <span>Azimuth: {{ azimuthDeg }}°</span> 
           <span>Elevation: {{ elevationDeg }}°</span> 
           <span>Dist: {{ radius.toFixed(1) }}</span> 
         </div> 
         <div class="prompt-box"> 
           <strong>Camera Prompt:</strong> 
           <p>{{ cameraPrompts.en }}</p> 
           <p class="cn-prompt">{{ cameraPrompts.cn }}</p> 
         </div> 
       </div> 
     </div> 
     <div ref="canvasContainer" class="canvas-wrapper"></div> 
   </div> 
 </template> 
 
 <script setup lang="ts"> 
 import { ref, onMounted, onUnmounted, computed } from 'vue' 
 import * as THREE from 'three' 
 
 /** 
  * 3D 摄像机控制组件 
  * 
  * 功能描述: 
  * 1. 渲染一个 3D 场景，包含一个倾斜的目标图片和辅助坐标轴。 
  * 2. 提供一个交互式的控制系统，允许用户通过拖动可视化手柄来调整虚拟摄像机的位置。 
  * 3. 绿色圆环控制水平旋转 (Azimuth)，粉色圆弧控制垂直高度 (Elevation)。 
  * 4. 实时显示虚拟摄像机在球面坐标系下的位置。 
  */ 
 
 // --- 状态定义 --- 
 const canvasContainer = ref<HTMLElement | null>(null) 
 /** 方位角 (Azimuth)，单位：弧度 */ 
 const azimuth = ref(0) 
 /** 仰角 (Elevation)，单位：弧度，初始值为 45 度 */ 
 const elevation = ref(Math.PI / 4) 
 /** 摄像机距离 (Radius)，初始值为 10 */ 
 const radius = ref(10) 
 
 // 计算属性：将弧度转换为角度显示给用户 
 const azimuthDeg = computed(() => (azimuth.value * 180 / Math.PI).toFixed(0)) 
 const elevationDeg = computed(() => (elevation.value * 180 / Math.PI).toFixed(0)) 
 
 /** 
  * 根据当前摄像机位置生成自然语言 Prompt (包含中英文) 
  */ 
 const cameraPrompts = computed(() => { 
   const az = parseFloat(azimuthDeg.value) // 角度 (-180 ~ 180) 
   const el = parseFloat(elevationDeg.value) // 角度 (-90 ~ 90) 
   const r = radius.value 
 
   // 1. 距离/景别 (Distance / Shot Size) 
   let dPromptEn = '' 
   let dPromptCn = '' 
   
   if (r < 4) { 
     dPromptEn = 'Extreme Close-up' 
     dPromptCn = '超近特写 (Extreme Close-up)' 
   } else if (r < 7) { 
     dPromptEn = 'Close-up' 
     dPromptCn = '特写 (Close-up)' 
   } else if (r < 12) { 
     dPromptEn = 'Medium Shot' 
     dPromptCn = '中景 (Medium Shot)' 
   } else if (r < 18) { 
     dPromptEn = 'Full Shot' 
     dPromptCn = '全景 (Full Shot)' 
   } else { 
     dPromptEn = 'Ultra Wide Angle' 
     dPromptCn = '超广角 (Ultra Wide Angle)' 
   } 
 
   // 2. 垂直视角 (Elevation) 
   let vPromptEn = '' 
   let vPromptCn = '' 
   if (el > 75) { 
     vPromptEn = 'Top-down view' 
     vPromptCn = '垂直俯视 (Top-down)' 
   } else if (el > 45) { 
     vPromptEn = 'High angle shot' 
     vPromptCn = '高角度俯拍 (High angle)' 
   } else if (el > 15) { 
     vPromptEn = 'Slightly high angle view' 
     vPromptCn = '微俯拍 (Slightly high)' 
   } else if (el >= -15) { 
     vPromptEn = 'Eye-level shot' 
     vPromptCn = '平视 (Eye-level)' 
   } else if (el >= -45) { 
     vPromptEn = 'Low angle shot' 
     vPromptCn = '低角度仰拍 (Low angle)' 
   } else { // < -45 
     vPromptEn = "Worm's-eye view" 
     vPromptCn = '极低角度仰拍 (Worm\'s-eye)' 
   } 
   
   // 3. 水平视角 (Azimuth) 
   // 规范化角度到 0-360 
   let normAz = az % 360 
   if (normAz < 0) normAz += 360 
   
   let hPromptEn = '' 
   let hPromptCn = '' 
   
   if ((normAz >= 337.5) || (normAz < 22.5)) { 
     hPromptEn = 'from the right side' 
     hPromptCn = '右侧视角' 
   } else if (normAz >= 22.5 && normAz < 67.5) { 
     hPromptEn = 'from the front-right' 
     hPromptCn = '右前视角' 
   } else if (normAz >= 67.5 && normAz < 112.5) { 
     hPromptEn = 'from the front' 
     hPromptCn = '正前视角' 
   } else if (normAz >= 112.5 && normAz < 157.5) { 
     hPromptEn = 'from the front-left' 
     hPromptCn = '左前视角' 
   } else if (normAz >= 157.5 && normAz < 202.5) { 
     hPromptEn = 'from the left side' 
     hPromptCn = '左侧视角' 
   } else if (normAz >= 202.5 && normAz < 247.5) { 
     hPromptEn = 'from the back-left' 
     hPromptCn = '左后视角' 
   } else if (normAz >= 247.5 && normAz < 292.5) { 
     hPromptEn = 'from the back' 
     hPromptCn = '正后视角' 
   } else if (normAz >= 292.5 && normAz < 337.5) { 
     hPromptEn = 'from the back-right' 
     hPromptCn = '右后视角' 
   } 
   
   // 4. 特殊组合优化 
   if (vPromptEn === 'Top-down view') { 
     return { 
       en: `Top-down view, ${dPromptEn}`, 
       cn: `垂直俯视 (Top-down), ${dPromptCn}` 
     } 
   } 
   if (vPromptEn === "Worm's-eye view" && Math.abs(el) > 80) { 
     return { 
       en: `Directly bottom-up view, ${dPromptEn}`, 
       cn: `垂直仰视 (Bottom-up), ${dPromptCn}` 
     } 
   } 
   
   return { 
     en: `${dPromptEn}, ${vPromptEn}, ${hPromptEn}`, 
     cn: `${dPromptCn}, ${vPromptCn}, ${hPromptCn}` 
   } 
 }) 
 
 // --- Three.js 核心对象 --- 
 let scene: THREE.Scene 
 let camera: THREE.PerspectiveCamera // 用户的观察视角 (固定) 
 let renderer: THREE.WebGLRenderer 
 let raycaster: THREE.Raycaster      // 用于鼠标交互检测 
 let mouse: THREE.Vector2 
 let canvasEl: HTMLCanvasElement | null = null 
 
 // --- 场景对象引用 --- 
 let greenHandle: THREE.Mesh         // 绿色球体手柄 (控制方位角) 
 let pinkHandle: THREE.Mesh          // 粉色球体手柄 (控制仰角) 
 let pinkArcLine: THREE.Line         // 粉色圆弧轨道 
 let cameraObj: THREE.Group          // 场景中的虚拟摄像机模型 (被控制对象) 
 let greenGroup: THREE.Group         // 绿色组 (随方位角旋转) 
 let pinkGroup: THREE.Group          // 粉色组 (随方位角旋转，内部包含仰角控制组件) 
 let greenRing: THREE.Mesh           // 绿色圆环 
 let greenDragSurface: THREE.Mesh | null = null 
 let pinkDragSurface: THREE.Mesh | null = null 
 let radiusLine: THREE.Line          // 半径虚线 
 
 // --- 交互状态 --- 
 let isDraggingGreen = false 
 let isDraggingPink = false 
 const HANDLE_SIZE = 0.5// 手柄大小 
 
 onMounted(() => { 
   if (!canvasContainer.value) return 
 
   // 1. 场景初始化 
   scene = new THREE.Scene() 
   scene.background = new THREE.Color(0xf0f0f0) // 浅灰背景 
 
   // 2. 观察摄像机设置 (固定视角) 
   const width = canvasContainer.value.clientWidth 
   const height = canvasContainer.value.clientHeight 
   camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000) 
   camera.position.set(15, 20, 25) // 固定在斜上方 
   camera.lookAt(0, 0, 0)          // 看向原点 
 
   // 3. 渲染器设置 
   renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }) // 开启抗锯齿 
   renderer.setSize(width, height) 
   renderer.setPixelRatio(window.devicePixelRatio) 
   canvasContainer.value.appendChild(renderer.domElement) 
   canvasEl = renderer.domElement 
 
   // 4. 灯光设置 
   const ambientLight = new THREE.AmbientLight(0xffffff, 0.6) 
   scene.add(ambientLight) 
   const dirLight = new THREE.DirectionalLight(0xffffff, 0.8) 
   dirLight.position.set(10, 20, 10) 
   scene.add(dirLight) 
 
   // --- 设计元素构建 --- 
 
   // A. 中心目标图片 (倾斜放置) 
   const textureLoader = new THREE.TextureLoader() 
   // 加载占位图片 
   const imgTexture = textureLoader.load('/image/构图.svg') 
   const planeGeo = new THREE.PlaneGeometry(12, 8) 
   const planeMat = new THREE.MeshBasicMaterial({  
     map: imgTexture, 
     side: THREE.DoubleSide, 
     transparent: true, 
     opacity: 0.9 
   }) 
   const imagePlane = new THREE.Mesh(planeGeo, planeMat) 
   
   // 调整图片姿态：先平放，再旋转，模拟空间中的任意平面 
   imagePlane.rotation.set(0, 0, 0) 
 
 
 
   // 添加局部坐标轴辅助线 
   const axisHelper = new THREE.AxesHelper(5) 
   imagePlane.add(axisHelper) 
   
   scene.add(imagePlane) 
 
   // B. 控制器组 (Rig Group) 
   // 为了让球坐标系相对于目标图片，我们创建一个组并复制图片的旋转 
   const rigGroup = new THREE.Group() 
   rigGroup.rotation.copy(imagePlane.rotation) 
   scene.add(rigGroup) 
 
   // 绿色圆环 (水平基准面) 
   const greenRingGeo = new THREE.RingGeometry(radius.value - 0.1, radius.value + 0.1, 64) 
   greenRingGeo.rotateX(-Math.PI / 2) 
   const greenRingMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }) 
   greenRing = new THREE.Mesh(greenRingGeo, greenRingMat) 
   rigGroup.add(greenRing) 
 
   const dragSurfaceMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }) 
 
   // 绿色拖拽平面 (XZ平面) - 替换原来的 Torus，以便允许半径变化 
   // 我们创建一个足够大的隐形平面用于射线检测 
   const planeGeoDrag = new THREE.PlaneGeometry(100, 100) 
   planeGeoDrag.rotateX(-Math.PI / 2) 
   greenDragSurface = new THREE.Mesh(planeGeoDrag, dragSurfaceMat) 
   rigGroup.add(greenDragSurface) 
 
   // 绿色手柄组 (负责方位角旋转) 
   greenGroup = new THREE.Group() 
   rigGroup.add(greenGroup) 
 
   // 绿色手柄 Mesh 
   const sphereGeo = new THREE.SphereGeometry(HANDLE_SIZE, 32, 32) 
   const greenMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 }) 
   greenHandle = new THREE.Mesh(sphereGeo, greenMat) 
   greenHandle.position.set(radius.value, 0, 0) // 初始位于 X 轴 
   greenGroup.add(greenHandle) 
 
   // C. 粉色控制组件 (垂直仰角) 
   // 粉色组作为绿色组的子对象，随之一起旋转 
   pinkGroup = new THREE.Group() 
   greenGroup.add(pinkGroup) 
   const pinkDragGeo = new THREE.TorusGeometry(radius.value, HANDLE_SIZE * 2, 12, 64) 
   pinkDragSurface = new THREE.Mesh(pinkDragGeo, dragSurfaceMat) 
   pinkGroup.add(pinkDragSurface) 
 
   // 粉色圆弧轨道 (-90 到 90 度) 
   const arcCurve = new THREE.EllipseCurve( 
     0, 0,            // 中心点 
     radius.value, radius.value,  // 半径 
     -Math.PI / 2, Math.PI / 2,  // 角度范围 
     false,           // 顺时针 
     0                // 旋转 
   ) 
   const points = arcCurve.getPoints(50) 
   const arcGeo = new THREE.BufferGeometry().setFromPoints(points) 
   const pinkLineMat = new THREE.LineBasicMaterial({ color: 0xff69b4, linewidth: 2 }) 
   pinkArcLine = new THREE.Line(arcGeo, pinkLineMat) 
   // 将圆弧添加到粉色组中 (默认在 XY 平面，正是我们需要竖起来的方向) 
   pinkGroup.add(pinkArcLine) 
 
   // 粉色手柄 Mesh 
   const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff69b4 }) 
   pinkHandle = new THREE.Mesh(sphereGeo, pinkMat) 
   pinkGroup.add(pinkHandle) 
   updatePinkHandlePos() // 设置初始位置 
 
   // D. 虚拟摄像机模型 (被控制的对象) 
   cameraObj = new THREE.Group() 
   
   // 机身 
   const camBody = new THREE.Mesh( 
     new THREE.BoxGeometry(1, 0.6, 0.4), 
     new THREE.MeshBasicMaterial({ color: 0x333333 })  
   ) 
   // 镜头 
   const camLens = new THREE.Mesh( 
     new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16), 
     new THREE.MeshStandardMaterial({ color: 0x444444 }) 
   ) 
   camLens.rotation.z = Math.PI / 2 
   camLens.position.x = 0.6 
   
   cameraObj.add(camBody) 
   cameraObj.add(camLens) 
   
   cameraObj.position.z = radius.value 
   // 连线：从原点到摄像机的虚线 
   radiusLine = new THREE.Line( 
     new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(radius.value,0,0)]), 
     new THREE.LineDashedMaterial({ color: 0x888888, dashSize: 0.5, gapSize: 0.2 }) 
   ) 
   radiusLine.computeLineDistances() 
   
   // 将摄像机模型添加到 Rig Group 中 
   rigGroup.add(cameraObj) 
   
   updateCameraObjPos() 
 
   // --- 事件监听 --- 
   raycaster = new THREE.Raycaster() 
   mouse = new THREE.Vector2() 
 
   canvasEl.addEventListener('pointermove', onPointerMove) 
   canvasEl.addEventListener('pointerdown', onPointerDown) 
   canvasEl.addEventListener('pointerup', onPointerUp) 
   canvasEl.addEventListener('pointercancel', onPointerUp) 
   window.addEventListener('resize', onWindowResize) 
 
   animate() 
 }) 
 
 onUnmounted(() => { 
   canvasEl?.removeEventListener('pointermove', onPointerMove) 
   canvasEl?.removeEventListener('pointerdown', onPointerDown) 
   canvasEl?.removeEventListener('pointerup', onPointerUp) 
   canvasEl?.removeEventListener('pointercancel', onPointerUp) 
   window.removeEventListener('resize', onWindowResize) 
   canvasEl = null 
   // 这里可以添加更多资源清理逻辑 
 }) 
 
 /** 
  * 更新粉色手柄的位置 
  * 根据当前的仰角 (elevation) 计算手柄在局部坐标系中的位置 
  */ 
 function updatePinkHandlePos() { 
   // 在 pinkGroup 的局部空间 (XY平面) 中计算 
   // x = R * cos(elevation) 
   // y = R * sin(elevation) 
   const x = radius.value * Math.cos(elevation.value) 
   const y = radius.value * Math.sin(elevation.value) 
   pinkHandle.position.set(x, y, 0) 
 } 
 
 /** 
  * 更新虚拟摄像机模型的位置 
  * 将球坐标 (r, theta, phi) 转换为笛卡尔坐标 (x, y, z) 
  */ 
 function updateCameraObjPos() { 
   const r = radius.value 
   const phi = elevation.value // 仰角 
   const theta = azimuth.value // 方位角 
   
   // 球坐标转笛卡尔坐标公式 
   const x = r * Math.cos(phi) * Math.cos(theta) 
   const z = r * Math.cos(phi) * Math.sin(theta) 
   const y = r * Math.sin(phi) 
   
   cameraObj.position.set(x, y, z) 
   cameraObj.lookAt(0, 0, 0) // 始终看向原点 
 } 
 
 /** 
  * 更新几何体尺寸 (当半径变化时) 
  */ 
 function updateGeometries() { 
   const r = radius.value 
   
   // 1. 更新绿色圆环 
   // RingGeometry 不支持直接更新参数，需要重新创建 Geometry 
   greenRing.geometry.dispose() 
   const newGreenRingGeo = new THREE.RingGeometry(r - 0.1, r + 0.1, 64) 
   newGreenRingGeo.rotateX(-Math.PI / 2) 
   greenRing.geometry = newGreenRingGeo 
   
   // 2. 更新绿色手柄位置 
   greenHandle.position.set(r, 0, 0) 
   
   // 3. 更新粉色圆弧轨道 
   if (pinkArcLine) { 
     const arcCurve = new THREE.EllipseCurve( 
       0, 0, 
       r, r, 
       -Math.PI / 2, Math.PI / 2, 
       false, 
       0 
     ) 
     const points = arcCurve.getPoints(50) 
     pinkArcLine.geometry.setFromPoints(points) 
   } 
   
   // 4. 更新粉色DragSurface (Torus) 
   // TorusGeometry 也不方便动态更新半径，建议重建 
   if (pinkDragSurface) { 
     pinkDragSurface.geometry.dispose() 
     pinkDragSurface.geometry = new THREE.TorusGeometry(r, HANDLE_SIZE * 2, 12, 64) 
   } 
   
   // 5. 更新粉色手柄位置 
   updatePinkHandlePos() 
 
   // 6. 更新半径虚线 
   if (radiusLine) { 
     radiusLine.geometry.setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(r,0,0)]) 
     radiusLine.computeLineDistances() 
   } 
 } 
 
 /** 
  * 鼠标按下事件处理 
  * 检测是否点击了控制手柄 
  */ 
 function onPointerDown(event: PointerEvent) { 
   if (!greenHandle || !pinkHandle) return 
   canvasEl?.setPointerCapture(event.pointerId) 
 
   updateMouse(event) 
   raycaster.setFromCamera(mouse, camera) 
   
   // 检测射线与手柄的相交 
   const intersects = raycaster.intersectObjects([greenHandle, pinkHandle], false) 
   
   if (intersects.length > 0) { 
     const first = intersects[0] 
     if (!first) return 
     const obj = first.object 
     // 标记当前正在拖拽的对象 
     if (obj === greenHandle) isDraggingGreen = true 
     if (obj === pinkHandle) isDraggingPink = true 
   } 
 } 
 
 /** 
  * 鼠标抬起事件处理 
  * 结束拖拽状态 
  */ 
 function onPointerUp(event: PointerEvent) { 
   isDraggingGreen = false 
   isDraggingPink = false 
   if (canvasEl?.hasPointerCapture(event.pointerId)) canvasEl.releasePointerCapture(event.pointerId) 
 } 
 
 /** 
  * 鼠标移动事件处理 
  * 执行具体的拖拽逻辑 
  */ 
 function onPointerMove(event: PointerEvent) { 
   updateMouse(event) 
   
   // 逻辑 1: 拖拽绿色手柄 (调整方位角 & 距离) 
   if (isDraggingGreen) { 
     raycaster.setFromCamera(mouse, camera) 
     const firstHit = greenDragSurface ? raycaster.intersectObject(greenDragSurface, false)[0] : undefined 
     if (!firstHit) return 
     const pt = firstHit.point.clone() 
     greenGroup.parent!.worldToLocal(pt) // 转到 RigGroup 空间 (中心在原点, XZ平面) 
     
     // 1. 计算方位角 
     azimuth.value = Math.atan2(pt.z, pt.x) 
     greenGroup.rotation.y = -azimuth.value 
 
     // 2. 计算距离 (半径) 
     const newRadius = Math.sqrt(pt.x * pt.x + pt.z * pt.z) 
     // 限制半径范围 (例如 2 到 25) 
     radius.value = Math.max(2, Math.min(25, newRadius)) 
     
     // 3. 更新几何体和摄像机 
     updateGeometries() 
     updateCameraObjPos() 
   } 
   
   // 逻辑 2: 拖拽粉色手柄 (调整仰角) 
   if (isDraggingPink) { 
     raycaster.setFromCamera(mouse, camera) 
     const firstHit = pinkDragSurface ? raycaster.intersectObject(pinkDragSurface, false)[0] : undefined 
     if (!firstHit) return 
     const pt = firstHit.point.clone() 
     pinkGroup.worldToLocal(pt) 
     let angle = Math.atan2(pt.y, pt.x) 
     // 限制角度范围在 -90 到 90 度之间 
     if (angle > Math.PI / 2) angle -= Math.PI * 2 // 处理 atan2 返回值的突变 (如从 PI 变 -PI) 
     angle = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angle)) 
     elevation.value = angle 
     updatePinkHandlePos() 
     updateCameraObjPos() 
   } 
 } 
 
 /** 
  * 更新归一化鼠标坐标 (-1 到 1) 
  */ 
 function updateMouse(event: PointerEvent) { 
   const rect = (canvasEl ?? canvasContainer.value!).getBoundingClientRect() 
   mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1 
   mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1 
 } 
 
 function onWindowResize() { 
   if (!canvasContainer.value) return 
   const width = canvasContainer.value.clientWidth 
   const height = canvasContainer.value.clientHeight 
   camera.aspect = width / height 
   camera.updateProjectionMatrix() 
   renderer.setSize(width, height) 
 } 
 
 function animate() { 
   requestAnimationFrame(animate) 
   renderer.render(scene, camera) 
 } 
 </script> 
 
 <style scoped> 
 .camera-move-container { 
   position: relative; 
   width: 100%; 
   height: 100vh; 
   overflow: hidden; 
 } 
 .canvas-wrapper { 
   width: 100%; 
   height: 100%; 
 } 
 .controls-overlay { 
   position: absolute; 
   top: 20px; 
   left: 20px; 
   z-index: 10; 
   pointer-events: none; /* Let clicks pass through to canvas */ 
 } 
 .controls-overlay > * { 
   pointer-events: auto; /* Re-enable for buttons */ 
 } 
 .info-panel { 
   background: rgba(255, 255, 255, 0.9); 
   padding: 15px; 
   border-radius: 8px; 
   margin-top: 10px; 
   box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
   min-width: 250px; 
 } 
 .info-panel h3 { 
   margin: 0 0 10px 0; 
   font-size: 1.1rem; 
   color: #333; 
 } 
 .info-panel p { 
   font-size: 0.9rem; 
   color: #666; 
   margin: 5px 0; 
 } 
 .prompt-box { 
   margin-top: 10px; 
   padding: 10px; 
   background: #f8f9fa; 
   border-radius: 4px; 
   border: 1px solid #e9ecef; 
 } 
 .prompt-box p { 
   color: #2c3e50; 
   font-style: italic; 
   font-weight: 500; 
   margin: 5px 0 0 0; 
 } 
 .cn-prompt { 
   font-style: normal !important; 
   color: #888 !important; 
   font-size: 0.85rem !important; 
 } 
 .values { 
   margin-top: 10px; 
   padding-top: 10px; 
   border-top: 1px solid #eee; 
   display: flex; 
   justify-content: space-between; 
   font-weight: bold; 
   color: #2c3e50; 
 } 
 </style>