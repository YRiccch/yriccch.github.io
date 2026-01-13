<script setup>
// Updated based on CV Experience
const newsItems = [
  { 
    date: '2026.01.01 - 2026.03.31', 
    content: 'Embark on a three-month visiting research stay at **Nanyang Technological University**, Singapore, under the supervision of **Prof. Wang**.' 
  },
  { 
    date: '2024.09', 
    content: 'Started Master\'s degree at **Hangzhou Dianzi University**.' 
  },
  { 
    date: '2024.04 - 2025.01', 
    content: 'Participated in project: **Intelligent Decision-Making System for Energy Pricing Based on Industry LLMs** (Front-end design & development).' 
  },
  { 
    date: '2023.06', 
    content: 'Graduated from **Hangzhou Dianzi University** (Undergraduate).' 
  },
  { 
    date: '2022.03', 
    content: 'Published paper: **Multi network sampling driven by representation learning** in Journal of Zhejiang University – SCIENCE.' 
  }
]
</script>

<template>
  <section id="news" class="section-container">
    <h2 class="section-title">🔥 {{ $t('news.title') }}</h2>
    
    <div class="timeline">
      <div class="timeline-axis"></div>
      <div v-for="(item, index) in newsItems" :key="index" class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content-wrapper">
          <div class="timeline-date">{{ item.date }}</div>
          <div class="timeline-body" v-html="item.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')"></div>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped lang="scss">
.section-container {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeline {
  position: relative;
  padding-left: 20px; /* Space for the markers */
  padding-top: 10px;
}

/* The vertical axis line */
.timeline-axis {
  position: absolute;
  left: 6px; /* Align with center of markers */
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ddd;
  
  /* Upward arrow at the top */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: -4px;
    border-width: 0 5px 8px 5px; /* Triangle pointing up */
    border-style: solid;
    border-color: transparent transparent #ddd transparent;
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 25px; /* Space between axis and content */
  
  &:last-child {
    margin-bottom: 1rem;
  }
}

/* The dot on the axis */
.timeline-marker {
  position: absolute;
  left: 2px; /* Center on the 2px wide line: (2px line - 10px marker)/2 + left:6px of line? No.
               Line is at left: 6px. Width 2px. Center is at 7px.
               Marker width 10px. To center at 7px, left should be 7 - 5 = 2px. */
  top: 5px; /* Align with date text */
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #0056b3;
  z-index: 1;
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-marker {
  background-color: #0056b3;
  transform: scale(1.2);
}

.timeline-content-wrapper {
  display: flex;
  flex-direction: column;
}

.timeline-date {
  font-family: 'Consolas', monospace;
  font-weight: 700;
  color: #0056b3;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.timeline-body {
  color: #333;
  font-size: 1rem;
  line-height: 1.6;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #e9ecef;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-left-color: #0056b3;
  }
}

.show-more {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #0056b3;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
}
</style>
