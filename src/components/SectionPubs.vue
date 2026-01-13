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
            <a v-for="link in pub.links" :key="link.name" :href="link.url" class="link-btn">
              <component :is="link.icon" size="14" />
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { FileText, Github } from 'lucide-vue-next'

const publications = [
  {
    title: "表征学习驱动的多重网络图采样",
    authors: "<b>虞瑞麒</b>，刘玉华，沈禧龙，翟如钰，张翔，周志光",
    venue: "Journal of Zhejiang University – SCIENCE (2022)",
    links: [
      // { name: 'Journal', url: '#', icon: FileText }
    ]
  }
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
  color: #222;
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
    color: #0056b3;
  }
  
  .pub-authors {
    font-size: 0.95rem;
    margin: 0 0 0.25rem 0;
    color: #444;
  }
  
  .pub-venue {
    font-size: 0.9rem;
    font-style: italic;
    color: #666;
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
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #555;
      background-color: #fff;
      
      &:hover {
        border-color: #0056b3;
        color: #0056b3;
      }
    }
  }
}
</style>
