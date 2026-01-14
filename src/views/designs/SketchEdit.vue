<template>
  <div class="sketch-edit-container">
    <div class="controls-overlay">
      <el-button @click="$router.push('/')" size="small">Back</el-button>
      
      <div class="info-panel">
        <h3>Sketch & Match</h3>
        <p>1. Upload an image</p>
        <p>2. Sketch camera movement trajectory</p>
        <p>3. Match template</p>

        <!-- Upload Section -->
        <div class="control-group">
          <input 
            type="file" 
            accept="image/*" 
            ref="fileInput" 
            class="hidden-input" 
            @change="handleFileUpload"
          />
          <el-button type="primary" @click="triggerUpload" size="small" class="w-full">
            Upload Image
          </el-button>
        </div>

        <!-- Brush Controls -->
        <div class="control-group">
          <label>Brush Color:</label>
          <div class="color-picker">
            <div 
              v-for="color in colors" 
              :key="color"
              :style="{ backgroundColor: color }"
              :class="['color-swatch', { active: brushColor === color }]"
              @click="brushColor = color"
            ></div>
          </div>
        </div>

        <div class="control-group">
          <label>Brush Size: {{ brushSize }}px</label>
          <input 
            type="range" 
            v-model.number="brushSize" 
            min="1" 
            max="20" 
            class="slider"
          />
        </div>

        <!-- Actions -->
        <div class="action-buttons">
          <el-button @click="clearCanvas" size="small">Clear Sketch</el-button>
          <el-button type="success" @click="matchTemplate" size="small" :loading="isMatching">
            Match Template
          </el-button>
        </div>

        <!-- Result -->
        <div v-if="matchedResult" class="result-box">
          <strong>Matched:</strong>
          <div class="result-tag">{{ matchedResult }}</div>
        </div>
      </div>
    </div>

    <div class="canvas-wrapper" ref="wrapper">
      <canvas 
        ref="canvasEl"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="startDrawing"
        @touchmove.prevent="draw"
        @touchend.prevent="stopDrawing"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// --- State ---
const canvasEl = ref<HTMLCanvasElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const uploadedImage = ref<HTMLImageElement | null>(null)
const imageScale = ref(1)
const imageOffset = ref({ x: 0, y: 0 })

const isDrawing = ref(false)
const brushColor = ref('#00ff00')
const brushSize = ref(5)
const colors = ['#00ff00', '#ff69b4', '#ffffff', '#000000', '#ff0000']

const isMatching = ref(false)
const matchedResult = ref('')
const strokes = ref<{x: number, y: number}[][]>([])
const currentStroke = ref<{x: number, y: number}[]>([])

// --- Lifecycle ---
onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// --- Canvas Management ---
function initCanvas() {
  if (!canvasEl.value || !wrapper.value) return
  
  const width = wrapper.value.clientWidth
  const height = wrapper.value.clientHeight
  
  // Handle High DPI
  const dpr = window.devicePixelRatio || 1
  canvasEl.value.width = width * dpr
  canvasEl.value.height = height * dpr
  canvasEl.value.style.width = `${width}px`
  canvasEl.value.style.height = `${height}px`
  
  ctx.value = canvasEl.value.getContext('2d')
  if (ctx.value) {
    ctx.value.scale(dpr, dpr)
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'
  }

  redraw()
}

function handleResize() {
  // Save current canvas content (sketch only) if needed, 
  // but for simplicity we just re-render the image and clear sketch or 
  // ideally we would back the sketch to an offscreen canvas.
  // Here we just re-init which might clear sketch, simpler for MVP.
  initCanvas() 
}

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        uploadedImage.value = img
        fitImageToCanvas()
        redraw()
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

function fitImageToCanvas() {
  if (!uploadedImage.value || !wrapper.value) return
  
  const canvasW = wrapper.value.clientWidth
  const canvasH = wrapper.value.clientHeight
  const imgW = uploadedImage.value.width
  const imgH = uploadedImage.value.height
  
  const scale = Math.min(canvasW / imgW, canvasH / imgH)
  imageScale.value = scale
  
  const drawW = imgW * scale
  const drawH = imgH * scale
  
  imageOffset.value = {
    x: (canvasW - drawW) / 2,
    y: (canvasH - drawH) / 2
  }
}

function redraw() {
  if (!canvasEl.value || !ctx.value || !wrapper.value) return
  
  const width = wrapper.value.clientWidth
  const height = wrapper.value.clientHeight
  
  // Clear
  ctx.value.clearRect(0, 0, width, height)
  
  // Draw Image
  if (uploadedImage.value) {
    ctx.value.drawImage(
      uploadedImage.value,
      imageOffset.value.x,
      imageOffset.value.y,
      uploadedImage.value.width * imageScale.value,
      uploadedImage.value.height * imageScale.value
    )
  }
  
  // Note: If we wanted to persist the sketch across redraws (like window resize),
  // we would need to store the strokes in an array and replay them here.
  // For this MVP, resizing clears the sketch, but drawing stays while not resizing.
}

function clearCanvas() {
  redraw()
  strokes.value = []
  matchedResult.value = ''
}

// --- Drawing Logic ---
function getPos(event: MouseEvent | TouchEvent) {
  if (!canvasEl.value) return { x: 0, y: 0 }
  const rect = canvasEl.value.getBoundingClientRect()
  
  let clientX = 0
  let clientY = 0
  
  if ('touches' in event) {
    const touches = (event as TouchEvent).touches
    if (touches && touches.length > 0) {
      const touch = touches[0]
      if (touch) {
        clientX = touch.clientX
        clientY = touch.clientY
      }
    }
  } else {
    clientX = (event as MouseEvent).clientX
    clientY = (event as MouseEvent).clientY
  }
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

function startDrawing(event: MouseEvent | TouchEvent) {
  if (!ctx.value) return
  isDrawing.value = true
  
  const { x, y } = getPos(event)
  currentStroke.value = [{ x, y }] // Start new stroke
  
  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
  ctx.value.strokeStyle = brushColor.value
  ctx.value.lineWidth = brushSize.value
}

function draw(event: MouseEvent | TouchEvent) {
  if (!isDrawing.value || !ctx.value) return
  
  const { x, y } = getPos(event)
  currentStroke.value.push({ x, y }) // Record point
  
  ctx.value.lineTo(x, y)
  ctx.value.stroke()
}

function stopDrawing() {
  if (!isDrawing.value || !ctx.value) return
  isDrawing.value = false
  ctx.value.closePath()
  
  if (currentStroke.value.length > 0) {
    strokes.value.push([...currentStroke.value])
  }
}

// --- Matching Logic ---
function matchTemplate() {
  isMatching.value = true
  matchedResult.value = ''
  
  // Simulate processing time
  setTimeout(() => {
    if (strokes.value.length === 0) {
      matchedResult.value = 'No sketch detected'
      isMatching.value = false
      return
    }

    // Analyze the last stroke
    const stroke = strokes.value[strokes.value.length - 1]
    if (!stroke || stroke.length === 0) {
       matchedResult.value = 'No stroke data'
       isMatching.value = false
       return
    }

    const start = stroke[0]
    const end = stroke[stroke.length - 1]
    
    if (!start || !end) {
       isMatching.value = false
       return
    }
    
    const dx = end.x - start.x
    const dy = end.y - start.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Calculate total path length to detect curvature
    let pathLength = 0
    for (let i = 1; i < stroke.length; i++) {
      const p1 = stroke[i-1]
      const p2 = stroke[i]
      if (p1 && p2) {
        pathLength += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      }
    }
    
    // Heuristic Rules
    // 1. Check for Orbit (High Curvature / Circular)
    // Ratio of path length to displacement distance. Circle is high, line is ~1.
    const curvatureRatio = distance > 0 ? pathLength / distance : 999
    
    if (curvatureRatio > 1.5 && pathLength > 50) {
      matchedResult.value = 'Orbit (环绕)'
    } else if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal Movement -> Pan
      if (dx > 0) {
        matchedResult.value = 'Pan Right (向右摇镜头)'
      } else {
        matchedResult.value = 'Pan Left (向左摇镜头)'
      }
    } else {
      // Vertical Movement -> Tilt or Zoom?
      if (dy > 0) {
        matchedResult.value = 'Tilt Down (向下摇摄)'
      } else {
        matchedResult.value = 'Tilt Up (向上摇摄)'
      }
    }
    
    isMatching.value = false
  }, 600)
}
</script>

<style scoped>
.sketch-edit-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f0f0;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.controls-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  pointer-events: none;
}

.controls-overlay > * {
  pointer-events: auto;
}

.info-panel {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 280px;
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

.control-group {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.control-group label {
  display: block;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 5px;
  font-weight: 600;
}

.hidden-input {
  display: none;
}

.w-full {
  width: 100%;
}

.color-picker {
  display: flex;
  gap: 8px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.1s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border-color: #333;
  box-shadow: 0 0 0 1px white inset;
}

.slider {
  width: 100%;
}

.action-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.result-box {
  margin-top: 15px;
  padding: 10px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  text-align: center;
}

.result-tag {
  margin-top: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #0050b3;
}
</style>