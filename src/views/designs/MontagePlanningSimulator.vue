<template>
  <div class="montage-planner">
    <!-- Navigation / Header -->
    <nav class="navbar">
      <div class="container nav-content">
        <div class="brand">
          <span class="logo-text">
            🎬 Montage<span class="highlight">AI</span> Planner
          </span>
        </div>
        <div class="nav-actions">
          <button @click="scrollToSection('simulation')" class="btn-primary">
            开始规划 (Start Planning)
          </button>
        </div>
      </div>
    </nav>

    <main class="container main-content">

      <!-- Section 1: Introduction -->
      <section class="intro-section">
        <h1 class="main-title">
          基于图式的镜头规划
          <span class="subtitle">Cinematic Idioms & Template Filling</span>
        </h1>
        <p class="intro-desc">
          如何解决 AI 在视频生成中“胡乱剪辑”的问题？答案不是让 AI 自由发挥，而是教它使用专业的<b>导演图式 (Cinematic Idioms)</b>。
        </p>
        
        <div class="intro-cards">
          <div class="card problem-card">
            <div class="card-title">❌ AI 自由生成</div>
            <p>容易产生幻觉，镜头逻辑混乱，缺乏叙事连贯性。就像一个没有受过训练的摄影师随意按快门。</p>
          </div>
          <div class="card solution-card">
            <div class="card-title">✅ 基于模板填充</div>
            <p>利用 "图式库 + 槽位填充" 技术。AI 扮演导演助理，负责选择最合适的模板并填入剧本细节，确保专业度。</p>
          </div>
        </div>
      </section>

      <!-- Section 2: The Logic -->
      <section class="logic-section">
        <div class="section-header">
          <h2>步骤 1: 构建导演图式库 (Director Idiom Library)</h2>
          <p>系统核心是一组预定义的 JSON 模板。针对普通场景，只需 5-6 个核心模板即可覆盖 80% 的需求。</p>
        </div>

        <div class="logic-grid">
          <!-- Chart Side -->
          <div class="logic-col chart-col">
            <h3>标准“建立序列” (Establish Sequence) 结构</h3>
            <p class="small-text">一个经典的场景引入通常包含以下镜头比例</p>
            <div class="chart-container">
              <canvas ref="idiomChartCanvas"></canvas>
            </div>
            <div class="info-box">
              <strong>逻辑解析：</strong> 先用全景 (Wide) 交代环境，再用中景 (Medium) 引入人物动作，最后用特写 (Close-up) 强调关键细节。
            </div>
          </div>

          <!-- Code Side -->
          <div class="logic-col code-col">
            <div class="code-header">
              <span class="file-name">idioms.json</span>
              <span class="read-only">Read-only View</span>
            </div>
            <pre><code class="json">
<span class="comment">// 模板 A: 建立序列 (Establish Sequence)</span>
{
  <span class="key">"id"</span>: <span class="string">"establish_sequence"</span>,
  <span class="key">"trigger"</span>: <span class="string">"new_scene"</span>,
  <span class="key">"shots"</span>: [
    { 
      <span class="key">"type"</span>: <span class="string">"Wide"</span>, 
      <span class="key">"subject"</span>: <span class="string">"Environment"</span>, 
      <span class="key">"duration"</span>: <span class="number">3</span> 
    },
    { 
      <span class="key">"type"</span>: <span class="string">"Medium"</span>, 
      <span class="key">"subject"</span>: <span class="string">"Character"</span>, 
      <span class="key">"action"</span>: <span class="string">"Enter"</span> 
    },
    { 
      <span class="key">"type"</span>: <span class="string">"CloseUp"</span>, 
      <span class="key">"focus"</span>: <span class="string">"Detail/Prop"</span> 
    }
  ]
}
            </code></pre>
          </div>
        </div>
      </section>

      <!-- Section 3: Simulator -->
      <section id="simulation" ref="simulationSection" class="sim-section">
        <div class="section-header">
          <h2>步骤 2 & 3: LLM 规划代理与可视化</h2>
          <p>
            在这里体验 AI 如何理解剧本，选择模板，并生成 Shotline (分镜时间轴)。
            <span class="badge">Interactive Demo</span>
          </p>
        </div>

        <div class="sim-panel">
          <div class="control-grid">
            
            <!-- Input -->
            <div class="control-col input-col step-arrow">
              <label>🎬 输入剧本片段 (Input Script)</label>
              <div class="textarea-wrapper">
                <textarea v-model="scriptInput" readonly></textarea>
                <span class="helper-text">Pre-loaded Example</span>
              </div>
            </div>

            <!-- Process -->
            <div class="control-col process-col step-arrow">
              <div class="process-inner">
                <h3>AI 规划代理 (Processing)</h3>
                <div ref="processingLog" class="log-window">
                  <div v-if="processingSteps.length === 0" class="log-placeholder">等待开始...</div>
                  <div v-for="(step, index) in processingSteps" :key="index" class="log-item fade-in">
                    <span class="check">✓</span> {{ step }}
                  </div>
                </div>
                <button 
                  @click="runSimulation" 
                  :disabled="isSimulating"
                  class="btn-run"
                >
                  {{ hasGenerated ? '🔄 重新规划 (Re-run)' : '🤖 运行规划代理 (Run Agent)' }}
                </button>
              </div>
            </div>

            <!-- Stats -->
            <div class="control-col stats-col">
              <label>📊 规划结果概览</label>
              <div class="stats-box">
                <div class="stat-row">
                  <span>识别类型:</span>
                  <strong>{{ simulationStats.type }}</strong>
                </div>
                <div class="stat-row">
                  <span>匹配模板:</span>
                  <span class="code-font highlight-text">{{ simulationStats.template }}</span>
                </div>
                <div class="stat-row">
                  <span>生成镜头数:</span>
                  <strong>{{ simulationStats.count }}</strong>
                </div>
                <div class="stat-footer">
                  提示：生成后，您可以点击下方的“切换图式”按钮来查看灵活性。
                </div>
              </div>
            </div>
          </div>

          <!-- Shotline -->
          <div class="shotline-area">
            <div class="shotline-header">
              <h3>🎞️ 镜头时间轴 (The Shotline)</h3>
              <div v-if="hasGenerated" class="shotline-actions fade-in">
                <span>不满意？切换图式:</span>
                <button 
                  v-for="(tpl, key) in templates" 
                  :key="key"
                  @click="switchTemplate(key)"
                  class="btn-pill"
                  :class="{ active: currentTemplateKey === key }"
                >
                  {{ tpl.shortName }}
                </button>
              </div>
            </div>

            <div class="shotline-scroll-container">
              <div class="shotline-track">
                <!-- Placeholder -->
                <div v-if="!currentShots.length && !isSimulating" class="empty-state">
                  <div class="icon">📽️</div>
                  <div>等待生成...</div>
                </div>
                
                <!-- Loading -->
                <div v-if="isSimulating && !currentShots.length" class="empty-state pulse">
                  <div class="icon">⚙️</div>
                  <div>Generating Plan...</div>
                </div>

                <!-- Cards -->
                <div 
                  v-for="(shot, index) in currentShots" 
                  :key="shot.uniqueId || shot.id"
                  class="shot-card slide-up"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <div class="card-top-bar"></div>
                  <div class="card-body">
                    <div class="card-meta">
                      <span class="badge-gray">Shot {{ shot.id }}</span>
                      <span class="duration">{{ shot.duration }}</span>
                    </div>
                    <h4>{{ shot.type }}</h4>
                    <div class="camera-move">{{ shot.camera }}</div>
                    <p class="desc-box">"{{ shot.desc }}"</p>
                  </div>
                  <div class="card-footer">
                    <span>SUBJECT</span>
                    <span class="subject-val">{{ shot.subject }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="timecode-bar">
              <span>00:00:00</span>
              <span>Timecode</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Tech Breakdown -->
      <section class="tech-section">
        <div class="tech-grid">
          <div class="tech-card">
            <h3>分层规划 (Hierarchical Planning)</h3>
            <p>这是本方案的学术亮点。系统不是直接生成像素，也不是直接写Prompt，而是分两层工作：</p>
            <ul class="tech-list">
              <li>
                <span class="step-num step-1">1</span>
                <div>
                  <strong>高层规划 (High-level)</strong>
                  <p>选择“模板”。这一步决定了剪辑的节奏和风格。</p>
                </div>
              </li>
              <li>
                <span class="step-num step-2">2</span>
                <div>
                  <strong>低层填充 (Low-level)</strong>
                  <p>填充“槽位”。将剧本中的具体实体填入模板定义的空槽中。</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="tech-card">
            <h3>为什么这样更稳妥？</h3>
            <div class="bar-chart-simple">
              <div class="bar-row">
                <span>控制力 (Control)</span>
                <div class="bar-bg"><div class="bar-fill orange" style="width: 95%"></div></div>
              </div>
              <div class="bar-row">
                <span>一致性 (Consistency)</span>
                <div class="bar-bg"><div class="bar-fill blue" style="width: 90%"></div></div>
              </div>
              <div class="bar-row">
                <span>幻觉率 (Hallucination)</span>
                <div class="bar-bg"><div class="bar-fill green" style="width: 10%"></div></div>
              </div>
              <p class="note">* 数据基于 Template-based vs End-to-End 对比。</p>
            </div>
          </div>
        </div>
      </section>

    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Montage Planning Simulator. Based on Cinematic Idioms Research.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import Chart from 'chart.js/auto';

// --- Data & State ---
const scriptInput = ref("张三推开废弃医院的门，看到地上有一个染血的口罩。");
const isSimulating = ref(false);
const hasGenerated = ref(false);
const processingSteps = ref([]);
const currentShots = ref([]);
const processingLog = ref(null);
const idiomChartCanvas = ref(null);
const simulationSection = ref(null);
const currentTemplateKey = ref('establish');

const simulationStats = reactive({
  type: '--',
  template: '--',
  count: '--'
});

// Templates Data
const templates = {
  establish: {
    id: "establish_sequence",
    name: "标准建立序列 (Standard)",
    shortName: "标准建立",
    shots: [
      { id: 1, type: "Wide Shot", subject: "Environment", desc: "Wide shot of an abandoned hospital, night, spooky fog", camera: "Static", duration: "3s" },
      { id: 2, type: "Medium Shot", subject: "Action", desc: "Medium shot of Zhang San pushing the rusty door open, looking nervous", camera: "Dolly In", duration: "2s" },
      { id: 3, type: "Close Up", subject: "Detail", desc: "Close-up of a bloody mask on the floor, sharp focus", camera: "Handheld", duration: "2s" }
    ]
  },
  suspense: {
    id: "suspense_buildup",
    name: "悬疑推进 (Suspense)",
    shortName: "悬疑推进",
    shots: [
      { id: 1, type: "Extreme CU", subject: "Detail", desc: "Extreme close-up of the rusty door handle turning slowly", camera: "Static", duration: "4s" },
      { id: 2, type: "Wide Shot", subject: "Environment", desc: "Wide shot from inside the dark hospital hall looking at the door opening", camera: "Zoom Out", duration: "3s" },
      { id: 3, type: "Medium Shot", subject: "Reaction", desc: "Medium shot of Zhang San freezing as he sees something on the floor", camera: "Dutch Angle", duration: "2s" },
      { id: 4, type: "Insert", subject: "Object", desc: "Quick insert shot of the bloody mask", camera: "Crash Zoom", duration: "0.5s" }
    ]
  },
  pov: {
    id: "pov_sequence",
    name: "主观视角 (POV)",
    shortName: "主观视角",
    shots: [
      { id: 1, type: "POV", subject: "View", desc: "POV shot moving towards the hospital door, hand reaching out", camera: "Handheld (Shaky)", duration: "3s" },
      { id: 2, type: "POV", subject: "Detail", desc: "POV looking down at the floor, discovering the bloody mask", camera: "Tilt Down", duration: "2s" },
      { id: 3, type: "Close Up", subject: "Reaction", desc: "Reverse shot: Close up of Zhang San's terrified eyes", camera: "Static", duration: "2s" }
    ]
  }
};

// --- Methods ---
const scrollToSection = (id) => {
  if (id === 'simulation' && simulationSection.value) {
    simulationSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const runSimulation = () => {
  if (isSimulating.value) return;
  isSimulating.value = true;
  hasGenerated.value = false;
  currentShots.value = [];
  processingSteps.value = [];
  simulationStats.type = '--';
  simulationStats.template = '--';
  simulationStats.count = '--';

  const steps = [
    { msg: "📄 分析剧本实体...", delay: 500 },
    { msg: "🔍 识别场景类型: 探索/发现", delay: 1200 },
    { msg: "📚 检索图式库...", delay: 1800 },
    { msg: "✅ 匹配图式: Establish Sequence", delay: 2400 },
    { msg: "🖊️ 填充槽位 (Filling Slots)...", delay: 3000 }
  ];

  let stepIndex = 0;
  const playStep = () => {
    if (stepIndex >= steps.length) {
      finishSimulation();
      return;
    }
    const step = steps[stepIndex];
    const timeoutDuration = stepIndex === 0 ? step.delay : (step.delay - steps[stepIndex - 1].delay);

    setTimeout(() => {
      processingSteps.value.push(step.msg);
      nextTick(() => {
        if (processingLog.value) processingLog.value.scrollTop = processingLog.value.scrollHeight;
      });
      stepIndex++;
      playStep();
    }, timeoutDuration);
  };
  playStep();
};

const finishSimulation = () => {
  isSimulating.value = false;
  hasGenerated.value = true;
  switchTemplate('establish');
};

const switchTemplate = (key) => {
  currentTemplateKey.value = key;
  const tpl = templates[key];
  currentShots.value = tpl.shots.map(s => ({ ...s, uniqueId: Math.random() }));
  simulationStats.type = "Discovery / Horror";
  simulationStats.template = tpl.id;
  simulationStats.count = tpl.shots.length;
};

onMounted(() => {
  if (idiomChartCanvas.value) {
    new Chart(idiomChartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Wide (Establish)', 'Medium (Action)', 'Close-up (Detail)'],
        datasets: [{
          data: [33, 33, 33],
          backgroundColor: ['#4A5568', '#C05621', '#F6E05E'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }
});
</script>

<style scoped>
/* =========================================
   Reset & Base
   ========================================= */
.montage-planner {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  background-color: #FDFBF7;
  color: #1A202C;
  min-height: 100vh;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* =========================================
   Navbar
   ========================================= */
.navbar {
  background-color: white;
  border-bottom: 1px solid #E2E8F0;
  position: sticky;
  top: 0;
  z-index: 50;
  height: 64px;
  display: flex;
  align-items: center;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.brand .logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #1A202C;
}

.highlight {
  color: #DD6B20; /* Orange-600 */
}

.btn-primary {
  background-color: #DD6B20;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #C05621;
}

/* =========================================
   Main Sections
   ========================================= */
.main-content {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Intro */
.intro-section {
  text-align: center;
  max-width: 56rem;
  margin: 0 auto;
}

.main-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.subtitle {
  color: #DD6B20;
  display: block;
  font-size: 1.875rem;
  margin-top: 0.5rem;
}

.intro-desc {
  font-size: 1.25rem;
  color: #718096;
  max-width: 42rem;
  margin: 0 auto;
}

.intro-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2.5rem;
}

@media (min-width: 768px) {
  .intro-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid #F7FAFC;
  text-align: left;
}

.solution-card {
  border-left: 4px solid #DD6B20;
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

/* Logic Section */
.logic-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid #E2E8F0;
}

.section-header {
  padding: 2rem;
  border-bottom: 1px solid #F7FAFC;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.logic-grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .logic-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.logic-col {
  padding: 2rem;
}

.chart-col {
  background-color: #F9FAFB;
  border-right: 1px solid #F7FAFC;
  text-align: center;
}

.code-col {
  background-color: #1A202C;
  color: #E2E8F0;
  overflow-x: auto;
}

.chart-container {
  height: 300px;
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 1.5rem auto;
}

.info-box {
  background: white;
  padding: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #E2E8F0;
  font-size: 0.875rem;
  color: #718096;
}

.code-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #4A5568;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.file-name { color: #F6AD55; font-weight: bold; font-family: monospace; }
.read-only { font-size: 0.75rem; color: #718096; }

pre { margin: 0; font-family: 'Menlo', monospace; font-size: 0.875rem; }
.comment { color: #68D391; }
.key { color: #D6BCFA; }
.string { color: #FAF089; }
.number { color: #F56565; }

/* =========================================
   Simulator Section
   ========================================= */
.sim-section {
  scroll-margin-top: 5rem;
}

.badge {
  background-color: #FEEBC8;
  color: #9C4221;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.sim-panel {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #E2E8F0;
  padding: 1.5rem;
}

.control-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .control-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.control-col label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4A5568;
  margin-bottom: 0.5rem;
}

.textarea-wrapper {
  position: relative;
  height: 100%;
}

textarea {
  width: 100%;
  height: 12rem;
  padding: 1rem;
  border: 1px solid #CBD5E0;
  border-radius: 0.5rem;
  resize: none;
  background-color: #F7FAFC;
  font-family: inherit;
}

.helper-text {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: #A0AEC0;
}

.process-inner {
  background-color: #EBF8FF;
  border: 1px solid #BEE3F8;
  padding: 1rem;
  border-radius: 0.5rem;
  height: 100%;
  text-align: center;
}

.process-inner h3 {
  color: #2A4365;
  font-weight: 700;
  margin-bottom: 1rem;
}

.log-window {
  background: white;
  height: 8rem;
  overflow-y: auto;
  border-radius: 0.25rem;
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.log-placeholder { color: #CBD5E0; font-style: italic; }
.log-item { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
.check { color: #48BB78; font-weight: bold; }

.btn-run {
  width: 100%;
  background-color: #3182CE;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s;
}
.btn-run:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-run:active { transform: scale(0.98); }

.step-arrow { position: relative; }
@media (min-width: 768px) {
  .step-arrow::after {
    content: '→';
    position: absolute;
    right: -1.25rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    color: #CBD5E0;
  }
}

.stats-box {
  background-color: #F7FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 1rem;
  height: 12rem;
  display: flex;
  flex-direction: column;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.stat-row strong { color: #1A202C; }
.highlight-text { color: #DD6B20; }
.code-font { font-family: monospace; }
.stat-footer { font-size: 0.75rem; color: #A0AEC0; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid #E2E8F0; }

/* Shotline */
.shotline-area { border-top: 1px solid #E2E8F0; padding-top: 2rem; }
.shotline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.shotline-header h3 { font-size: 1.25rem; font-weight: 700; }

.btn-pill {
  padding: 0.25rem 0.75rem;
  border: 1px solid #CBD5E0;
  border-radius: 0.25rem;
  background: white;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  cursor: pointer;
}
.btn-pill:hover { background: #F7FAFC; }
.btn-pill.active { background: #FFFAF0; border-color: #FBD38D; color: #C05621; font-weight: bold; }

.shotline-scroll-container {
  background-color: #2D3748;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.shotline-track {
  display: flex;
  gap: 1rem;
  min-width: max-content;
  padding-bottom: 0.5rem;
}

.empty-state {
  width: 100%;
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #718096;
  width: 100vw; /* fill view */
  max-width: 800px;
}
.empty-state .icon { font-size: 2rem; margin-bottom: 0.5rem; }

/* Cards */
.shot-card {
  width: 16rem;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #4A5568;
  display: flex;
  flex-direction: column;
}

.card-top-bar { height: 0.5rem; background-color: #DD6B20; }
.card-body { padding: 0.75rem; flex-grow: 1; }
.card-meta { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.badge-gray { background: #EDF2F7; padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
.duration { font-family: monospace; font-size: 0.75rem; color: #A0AEC0; }
.shot-card h4 { margin: 0 0 0.25rem 0; font-size: 0.875rem; font-weight: bold; }
.camera-move { font-size: 0.75rem; color: #3182CE; font-weight: 600; margin-bottom: 0.5rem; }
.desc-box { font-size: 0.75rem; color: #4A5568; background: #F7FAFC; padding: 0.5rem; border: 1px solid #EDF2F7; border-radius: 0.25rem; height: 4rem; overflow: hidden; }

.card-footer {
  background: #1A202C;
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-footer span { font-size: 0.625rem; color: #A0AEC0; letter-spacing: 0.05em; }
.card-footer .subject-val { color: #F6AD55; font-family: monospace; font-size: 0.75rem; }

.timecode-bar { display: flex; justify-content: space-between; font-size: 0.75rem; color: #718096; margin-top: 0.5rem; padding: 0 0.5rem; }

/* Tech Section */
.tech-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 768px) { .tech-grid { grid-template-columns: 1fr 1fr; } }

.tech-list { list-style: none; padding: 0; }
.tech-list li { display: flex; margin-bottom: 1rem; }
.step-num { width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; margin-right: 0.75rem; flex-shrink: 0; }
.step-1 { background: #EBF8FF; color: #3182CE; }
.step-2 { background: #F0FFF4; color: #38A169; }

.bar-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.bar-row span { font-size: 0.875rem; color: #4A5568; width: 40%; }
.bar-bg { width: 55%; background: #EDF2F7; height: 0.625rem; border-radius: 999px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 999px; }
.bar-fill.orange { background: #DD6B20; }
.bar-fill.blue { background: #4299E1; }
.bar-fill.green { background: #48BB78; }

.footer { border-top: 1px solid #E2E8F0; padding: 2rem 0; text-align: center; color: #A0AEC0; font-size: 0.875rem; margin-top: 3rem; }

/* Animations */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.fade-in { animation: fadeInUp 0.3s ease-out forwards; }
.slide-up { animation: slideUp 0.5s ease-out forwards; opacity: 0; }
.pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
</style>