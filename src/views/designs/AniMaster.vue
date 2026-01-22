<script setup>
import { ref, computed } from 'vue'
import questionsData from '@/data/questionnares/questionnaires.json'
const questions = questionsData

const currentStep = ref(0)
const answers = ref({})
const isSubmitting = ref(false)
// TODO: Replace with your deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL' 

const currentQuestion = computed(() => questions[currentStep.value])
const progress = computed(() => (currentStep.value / (questions.length - 1)) * 100)
const isNextDisabled = computed(() => !validateStep())

// Type Badge Logic
const typeLabel = computed(() => {
  const type = currentQuestion.value.type
  switch (type) {
    case 'single': return '单选'
    case 'multi': return '多选'
    case 'slider': return '滑动评分'
    case 'sortable': return '排序'
    case 'text': return '文本'
    default: return ''
  }
})

const mappedSpace = computed(() => {
  let space = { 
    d1: [], d2: [], d3: [], d4: [] 
  }

  questions.forEach(q => { 
    // Slider check
    if (q.type === 'slider' && answers.value[q.id] && q.mapping) {
      space[q.dimension].push(`${q.mapping}: ${answers.value[q.id]}`)
    }
    // Standard Options check
    else if (q.options && answers.value[q.id]) { 
      // Handle Sortable: answers is array of IDs in order
      if (q.type === 'sortable') {
        const sortedIds = answers.value[q.id]
        if (sortedIds && sortedIds.length > 0) {
           space[q.dimension].push(`${q.title.split(' ')[1]}排序`) // Use second word as key since title changed
        }
      } 
      // Handle Single/Multi
      else {
        q.options.forEach(opt => { 
          if (answers.value[q.id].includes(opt.id) && opt.mapping) { 
            space[q.dimension].push(opt.mapping) 
          } 
        }) 
      }
    } 
  })
  
  return space
})

function selectOption(qId, optId, type) {
  if (!answers.value[qId]) answers.value[qId] = []
  
  const currentAns = answers.value[qId]
  
  if (type === 'sortable') {
    const index = currentAns.indexOf(optId)
    if (index > -1) {
      currentAns.splice(index, 1) // Deselect
    } else {
      currentAns.push(optId) // Add to end of list
    }
  } else if (type === 'single') {
    answers.value[qId] = [optId]
  } else {
    // Multi - No limits
    const index = currentAns.indexOf(optId)
    if (index > -1) {
      currentAns.splice(index, 1)
    } else {
      // Removed maxSelect check
      currentAns.push(optId)
    }
  }
}

function isOptionSelected(qId, optId) {
  return answers.value[qId] && answers.value[qId].includes(optId)
}

function getSortIndex(qId, optId) {
  if (!answers.value[qId]) return -1
  return answers.value[qId].indexOf(optId) + 1
}

function validateStep() {
  const q = currentQuestion.value
  if (q.type === 'intro' || q.type === 'result') return true
  if (q.type === 'slider') return true // Slider always has value
  if (q.type === 'text') {
    // Optional or Required? Let's require at least 1 char for meaningful input
    return answers.value[q.id] && answers.value[q.id].length > 0
  }
  if (q.type === 'sortable') {
    // Require sorting all options?
    return answers.value[q.id] && answers.value[q.id].length === q.options.length
  }
  return answers.value[q.id] && answers.value[q.id].length > 0
}

function nextStep() {
  if (currentStep.value < questions.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function submitData() {
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
    alert('Developer: Please configure the Google Script URL in the code.')
    console.warn('Missing GOOGLE_SCRIPT_URL')
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const payload = { ...answers.value }
    // Add client-side metadata
    payload._meta = {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }

    // Use text/plain to prevent CORS preflight OPTIONS request
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (result.status === 'success') {
      console.log('Survey Data Saved:', result)
      alert('数据已成功提交！感谢您的参与。')
    } else {
      throw new Error(result.message || 'Server returned error')
    }
  } catch (err) {
    console.error('Submit Error:', err)
    alert('提交失败，请检查网络或联系管理员。\n' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

// Initialize Slider defaults
questions.forEach(q => {
  if (q.type === 'slider') {
    answers.value[q.id] = Math.ceil((q.min + q.max) / 2)
  }
})
</script>

<template>
  <div class="animaster-wrapper">
    <div class="container" id="app"> 
      <!-- Header --> 
      <header> 
        <div class="logo"><i class="fas fa-film"></i> AniMaster Research</div> 
        <div class="progress-container"> 
          <div class="progress-bar" :style="{ width: progress + '%' }"></div> 
        </div> 
      </header> 
  
      <!-- Question Area --> 
      <div class="question-card"> 
        <!-- Intro -->
        <div v-if="currentQuestion.type === 'intro'" class="intro-view">
          <i class="fas fa-video intro-icon"></i> 
          <h2>{{ currentQuestion.title }}</h2> 
          <p class="intro-desc">{{ currentQuestion.desc }}</p> 
        </div>

        <!-- Result -->
        <div v-else-if="currentQuestion.type === 'result'" class="result-view">
           <div class="expert-badge">调研分析报告</div> 
           <h2>感谢您的参与！</h2> 
           <p>根据您的回答，我们为您推导出了以下<b>“动画计算设计空间”</b>。<br>这也正是我们系统中 AI 将辅助您进行决策的核心维度。</p> 
            
           <div class="design-space-map"> 
             <div class="ds-card ds-d1" :class="{ highlight: mappedSpace.d1.length > 0 }"> 
               <span class="ds-title" style="color: #ff7675;">D1: 叙事状态空间</span> 
               <div class="ds-content"> 
                 <b>AI 将自动追踪：</b><br> 
                 {{ mappedSpace.d1.length ? mappedSpace.d1.join('、') : '未重点关注' }}
               </div> 
             </div> 
             <div class="ds-card ds-d2" :class="{ highlight: mappedSpace.d2.length > 0 }"> 
               <span class="ds-title" style="color: #a29bfe;">D2: 视觉叙事逻辑</span> 
               <div class="ds-content"> 
                 <b>AI 将辅助编排：</b><br> 
                 {{ mappedSpace.d2.length ? mappedSpace.d2.join('、') : '基础连接' }}
               </div> 
             </div> 
             <div class="ds-card ds-d3" :class="{ highlight: mappedSpace.d3.length > 0 }"> 
               <span class="ds-title" style="color: #fdcb6e;">D3: 视觉美学空间</span> 
               <div class="ds-content"> 
                 <b>AI 将精准控制：</b><br> 
                 {{ mappedSpace.d3.length ? mappedSpace.d3.join('、') : '通用参数' }}
               </div> 
             </div> 
             <div class="ds-card ds-d4" :class="{ highlight: mappedSpace.d4.length > 0 }"> 
               <span class="ds-title" style="color: #55efc4;">D4: 交互与级联</span> 
               <div class="ds-content"> 
                 <b>AI 将支持：</b><br> 
                 {{ mappedSpace.d4.length ? mappedSpace.d4.join('、') : '手动修改' }}
               </div> 
             </div> 
           </div> 
  
           <div style="margin-top:30px;"> 
             <button class="btn btn-next" @click="submitData" :disabled="isSubmitting">
               {{ isSubmitting ? '提交中...' : '提交数据' }} 
               <i v-if="!isSubmitting" class="fas fa-check"></i>
               <i v-else class="fas fa-spinner fa-spin"></i>
             </button> 
           </div> 
        </div>

        <!-- Questions -->
        <div v-else>
          <div class="question-header">
             <div class="category-tag">{{ currentQuestion.category }}</div> 
             <div v-if="typeLabel" class="type-badge">{{ typeLabel }}</div>
          </div>
          <h2>{{ currentQuestion.title }}</h2> 

          <!-- Slider Type -->
          <div v-if="currentQuestion.type === 'slider'" class="slider-container">
             <div class="slider-val">{{ answers[currentQuestion.id] }}</div>
             <input 
               type="range" 
               :min="currentQuestion.min" 
               :max="currentQuestion.max" 
               v-model.number="answers[currentQuestion.id]" 
               class="slider-input"
             />
             <div class="slider-labels">
               <span>{{ currentQuestion.labels[currentQuestion.min] }}</span>
               <span>{{ currentQuestion.labels[currentQuestion.max] }}</span>
             </div>
          </div>

          <!-- Text Type -->
          <div v-else-if="currentQuestion.type === 'text'" class="text-container">
            <textarea 
              v-model="answers[currentQuestion.id]" 
              placeholder="请输入您的看法..." 
              class="text-input"
              rows="5"
            ></textarea>
          </div>

          <!-- Options (Single/Multi/Sortable) -->
          <div v-else class="options-grid" :class="{ 'grid-2': currentQuestion.isGrid2 }"> 
            <div 
              v-for="opt in currentQuestion.options" 
              :key="opt.id"
              class="option-item" 
              :class="{ selected: isOptionSelected(currentQuestion.id, opt.id) }"
              @click="selectOption(currentQuestion.id, opt.id, currentQuestion.type)"
            > 
              <div v-if="currentQuestion.type === 'sortable'" class="sort-badge" :class="{ active: isOptionSelected(currentQuestion.id, opt.id) }">
                 {{ isOptionSelected(currentQuestion.id, opt.id) ? getSortIndex(currentQuestion.id, opt.id) : '' }}
              </div>
              <i v-else class="fas" :class="opt.icon || 'fa-circle'"></i> <!-- Default icon if missing -->
              
              <span>{{ opt.text }}</span> 
              
              <i v-if="currentQuestion.type !== 'sortable'" class="fas fa-check-circle check-mark"></i> 
            </div> 
          </div> 
          
          <p v-if="currentQuestion.type === 'multi'" class="hint-text">
            * 多项选择（不限数量）
          </p> 
           <p v-if="currentQuestion.type === 'sortable'" class="hint-text">
            * 请按重要程度依次点击选项进行排序
          </p> 

          <!-- Unified Comment Section for Every Question -->
          <div class="comment-section">
            <div class="comment-label">
               <i class="fas fa-pen-nib"></i> 我有更多建议/补充...
            </div>
            <div class="comment-box">
              <textarea 
                v-model="answers[currentQuestion.id + '_comment']"
                placeholder="作为专家，您对该问题有何补充见解？请自由表达..."
                class="text-input comment-area"
                rows="3"
              ></textarea>
            </div>
          </div>

        </div>
      </div> 
  
      <!-- Navigation --> 
      <div v-if="currentQuestion.type !== 'result'" class="nav-buttons" id="nav-container"> 
        <button v-show="currentStep > 0" class="btn btn-prev" @click="prevStep"><i class="fas fa-arrow-left"></i> 上一步</button> 
        <button 
          class="btn btn-next" 
          @click="nextStep"
          :disabled="isNextDisabled"
        >
          {{ currentQuestion.btnText || '下一步' }} <i class="fas fa-arrow-right"></i>
        </button> 
      </div> 
    </div> 
  </div>
</template>

<style scoped>
/* Scoped variables wrapper */
.animaster-wrapper {
  --primary: #6c5ce7; 
  --secondary: #a29bfe; 
  --bg: #f8f9fa; 
  --text: #2d3436; 
  --card-bg: #ffffff; 
  --success: #00b894; 
  --accent: #fd79a8;
  
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif; 
  background-color: var(--bg); 
  color: var(--text); 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 100vh; 
  width: 100%;
  padding: 20px;
}

/* 容器 */ 
.container { 
  width: 100%; 
  max-width: 800px; 
  background: var(--card-bg); 
  border-radius: 20px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); 
  padding: 40px; 
  position: relative; 
  min-height: 600px; 
  display: flex; 
  flex-direction: column; 
  transition: all 0.3s ease; 
} 

/* 头部与进度条 */ 
header { 
  margin-bottom: 30px; 
} 
.logo { 
  font-weight: 800; 
  color: var(--primary); 
  font-size: 1.5rem; 
  margin-bottom: 10px; 
  display: inline-block; 
} 
.progress-container { 
  width: 100%; 
  height: 6px; 
  background: #eee; 
  border-radius: 3px; 
  overflow: hidden; 
} 
.progress-bar { 
  height: 100%; 
  background: linear-gradient(90deg, var(--primary), var(--accent)); 
  width: 0%; 
  transition: width 0.5s ease; 
} 

/* 问题区域 */ 
.question-card { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  animation: fadeIn 0.5s ease; 
} 

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.category-tag { 
  font-size: 0.85rem; 
  color: #b2bec3; 
  text-transform: uppercase; 
  letter-spacing: 1px; 
  margin-bottom: 0; 
  font-weight: 600; 
} 

.type-badge {
  background: var(--secondary);
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

h2 { 
  font-size: 1.8rem; 
  margin-top: 0; 
  margin-bottom: 25px; 
  line-height: 1.3; 
} 

/* Intro specific styles */
.intro-view {
  text-align:center; 
  padding: 20px;
}
.intro-icon {
  font-size: 4rem; 
  color: var(--primary); 
  margin-bottom: 20px;
}
.intro-desc {
  font-size: 1.1rem; 
  color: #666; 
  line-height: 1.6;
}

/* Slider Styles */
.slider-container {
  padding: 20px 0;
  text-align: center;
}
.slider-input {
  width: 100%;
  margin: 20px 0;
  accent-color: var(--primary);
  height: 8px;
  background: #eee;
  border-radius: 5px;
  outline: none;
}
.slider-val {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 0.9rem;
}

/* Text Input Styles */
.text-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
}
.text-input:focus {
  border-color: var(--primary);
}

/* 选项样式 */ 
.options-grid { 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 15px; 
} 
 
/* 多列布局适配 */ 
.options-grid.grid-2 { grid-template-columns: 1fr 1fr; } 
 
.option-item { 
  background: #fdfdfd; 
  border: 2px solid #eee; 
  padding: 15px 20px; 
  border-radius: 12px; 
  cursor: pointer; 
  transition: all 0.2s; 
  display: flex; 
  align-items: center; 
  font-size: 1.05rem; 
  position: relative; 
} 

.option-item:hover { 
  border-color: var(--secondary); 
  transform: translateY(-2px); 
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.1); 
} 

.option-item.selected { 
  border-color: var(--primary); 
  background: rgba(108, 92, 231, 0.05); 
  font-weight: 600; 
} 

.option-item i { 
  margin-right: 15px; 
  color: var(--primary); 
  font-size: 1.2rem; 
} 

.sort-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ccc;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  transition: all 0.2s;
}
.sort-badge.active {
  background: var(--primary);
  border-color: var(--primary);
}

.check-mark { 
  margin-left: auto; 
  color: var(--primary); 
  opacity: 0; 
  transform: scale(0.5); 
  transition: all 0.2s; 
} 

.option-item.selected .check-mark { 
  opacity: 1; 
  transform: scale(1); 
} 

.hint-text {
  font-size: 0.9rem; 
  color: #888; 
  margin-top: 10px;
}

/* Comment Section Styles */
.comment-section {
  margin-top: 25px;
  border-top: 1px dashed #eee;
  padding-top: 15px;
}
.comment-label {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.comment-box {
  margin-top: 5px;
  animation: fadeIn 0.3s ease;
}
.comment-area {
  font-size: 0.9rem;
  border-color: #f0f0f0;
}
.comment-area:focus {
  border-color: var(--secondary);
}


/* 底部导航 */ 
.nav-buttons { 
  margin-top: 40px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
} 

.btn { 
  padding: 12px 30px; 
  border-radius: 50px; 
  border: none; 
  cursor: pointer; 
  font-size: 1rem; 
  font-weight: 600; 
  transition: all 0.3s; 
} 

.btn-prev { 
  background: transparent; 
  color: #636e72; 
} 
.btn-prev:hover { color: var(--text); } 

.btn-next { 
  background: var(--primary); 
  color: white; 
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3); 
} 
.btn-next:hover { 
  background: #5649c0; 
  transform: translateY(-2px); 
} 
.btn-next:disabled { 
  background: #dfe6e9; 
  cursor: not-allowed; 
  box-shadow: none; 
  transform: none; 
} 

/* 结果页样式 */ 
.result-view { 
  text-align: center; 
} 
 
.design-space-map { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
  margin-top: 30px; 
  text-align: left; 
} 

.ds-card { 
  background: #f8f9fa; 
  padding: 20px; 
  border-radius: 15px; 
  border-left: 5px solid #ccc; 
} 
 
.ds-card.highlight { 
  background: #fff; 
  box-shadow: 0 5px 20px rgba(0,0,0,0.08); 
  border-left-width: 5px; 
  animation: pulse 2s infinite; 
} 

.ds-d1 { border-color: #ff7675; } 
.ds-d2 { border-color: #a29bfe; } 
.ds-d3 { border-color: #fdcb6e; } 
.ds-d4 { border-color: #55efc4; } 

.ds-title { font-weight: 800; font-size: 1.1rem; margin-bottom: 10px; display: block; } 
.ds-content { font-size: 0.9rem; color: #636e72; } 
 
.expert-badge { 
  display: inline-block; 
  background: var(--primary); 
  color: white; 
  padding: 5px 15px; 
  border-radius: 20px; 
  font-size: 0.8rem; 
  margin-bottom: 20px; 
} 

@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
} 

@keyframes pulse { 
  0% { transform: scale(1); } 
  50% { transform: scale(1.02); } 
  100% { transform: scale(1); } 
} 

/* 移动端适配 */ 
@media (max-width: 600px) { 
  .container { padding: 20px; min-height: 100vh; border-radius: 0; } 
  .options-grid.grid-2 { grid-template-columns: 1fr; } 
  .design-space-map { grid-template-columns: 1fr; } 
} 
</style>