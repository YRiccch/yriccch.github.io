<script setup>
// Updated based on CV Experience
const newsItems = [
  { 
    date: '2025.07 - Present', 
    content: 'Working on paper: **AniMaster**: Human-Computer Collaborative Generation of Long-Form Animation from the Director\'s Perspective.' 
  },
  { 
    date: '2025.05 - Present', 
    content: 'Started project: **AI-Powered Simulation Training Platform** for Huzhou Tobacco Discipline Inspection and Supervision (Responsible for architecture & dev).' 
  },
  { 
    date: '2025.04', 
    content: 'Submitted paper **COIVis** to IEEE VIS 2025.' 
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
    date: '2021.10 - 2022.03', 
    content: 'Published paper: **Multi network sampling driven by representation learning** in Journal of Zhejiang University – SCIENCE.' 
  }
]
</script>

<template>
  <section id="news" class="section-container">
    <h2 class="section-title">🔥 {{ $t('news.title') }}</h2>
    
    <ul class="news-list">
      <li v-for="(item, index) in newsItems" :key="index" class="news-item">
        <span class="date">{{ item.date }}:</span>
        <span class="content" v-html="item.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')"></span>
      </li>
    </ul>
    
    <a href="#" class="show-more">{{ $t('news.more') }}</a>
  </section>
</template>

<style scoped lang="scss">
.section-container {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.news-list {
  margin-bottom: 1rem;
  
  .news-item {
    margin-bottom: 0.8rem;
    font-size: 1rem;
    line-height: 1.5;
    
    .date {
      font-family: 'Consolas', monospace;
      font-weight: 600;
      margin-right: 0.5rem;
      color: #555;
      white-space: nowrap;
    }
    
    .content {
      color: #333;
    }
  }
}

.show-more {
  font-size: 0.9rem;
  color: #0056b3;
  &:hover {
    text-decoration: underline;
  }
}
</style>
