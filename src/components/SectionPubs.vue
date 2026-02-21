<template>
  <section id="publications" class="section-container">
    <h2 class="section-title">📝 {{ $t('pubs.title') }}</h2>
    
    <div class="pubs-list">
      <div v-for="(pub, index) in publications" :key="index" class="pub-item">
        <div class="pub-content">
          <h3 class="pub-title">{{ pub.title }}</h3>
          <p class="pub-authors" v-html="pub.authors"></p>
          <p class="pub-venue">{{ pub.venue }}</p>
          
          <div class="pub-links" v-if="pub.links.length > 0">
            <template v-for="(link, lIndex) in pub.links" :key="link.name">
              <a :href="link.url" class="link-btn" target="_blank" rel="noopener noreferrer">
                <component :is="link.icon" size="14" />
                {{ link.name }}
              </a>
              <span v-if="lIndex < pub.links.length - 1" class="separator">|</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { FileText, Github, BookOpen } from 'lucide-vue-next'

const publications = [
  {
    title: "表征学习驱动的多重网络图采样",
    authors: "<b>虞瑞麒</b>，刘玉华，沈禧龙，翟如钰，张翔，周志光",
    venue: "Journal of Zhejiang University – SCIENCE (2022)",
    links: [
      { name: 'Journal', url: 'https://www.academax.com/ZDXBLXB/doi/10.3785/j.issn.1008-9497.2022.03.002', icon: FileText }
    ]
  },
  {
    title: "A Hierarchical Electricity Consumption Forecasting Visualization System based on Multi-scale LSTM-KAN Model",
    authors: "Hang Yin, Yize Li, Ning Xu, <b>Ruiqi Yu</b>, Ningxin Li, Wei Xu, Xiangyang Wu, Jie Xu, Yongheng Wang, Zhiguang Zhou",
    venue: "ChinaVis 2025",
    links: [
      { name: 'Paper', url: 'https://chinavis.org/2025/papers/A%20Hierarchical%20Electricity%20Consumption%20Forecasting%20Visualization%20System%20Based%20on%20Multi-scale%20LSTM-KAN%20Model.pdf', icon: FileText }
    ]
  },
    {
    title: "HyperMOOC: Augmenting MOOC Videos with Concept-based Embedded Visualizations",
    authors: "Li Ye, Lei Wang, Lihong Cai, <b>Ruiqi Yu</b>, Yong Wang, Yigang Wang, Wei Chen, Zhiguang Zhou",
    venue: "ACM CHI",
    links: [
      { name: 'arXiv', url: 'https://arxiv.org/pdf/2509.08404', icon: BookOpen },
      { name: 'Project', url: 'https://hypermooc.github.io/HyperMOOC/', icon: Github }
    ]
  },
]
</script>

<style scoped lang="scss">
.section-container {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pubs-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pub-item {
  display: flex;
  gap: 1rem;
  
  .pub-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    color: var(--primary-color);
  }
  
  .pub-authors {
    font-size: 0.95rem;
    margin: 0 0 0.25rem 0;
    color: var(--text-secondary);
  }
  
  .pub-venue {
    font-size: 0.9rem;
    font-style: italic;
    color: var(--text-tertiary);
    margin: 0 0 0.5rem 0;
  }
  
  .pub-links {
    display: flex;
    gap: 0.5rem;
    
    .link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-secondary);
      background-color: var(--card-bg);
      transition: all 0.2s;
      
      &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }

    .separator {
      color: var(--border-color);
      display: flex;
      align-items: center;
      font-size: 0.9rem;
    }
  }
}
</style>
