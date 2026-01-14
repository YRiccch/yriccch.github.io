<template>
  <section id="gallery" class="section-container">
    <h2 class="section-title">🎨 {{ $t('gallery.title') }}</h2>
    <p class="section-desc">{{ $t('gallery.desc') }}</p>
    
    <div class="gallery-grid">
      <div 
        v-for="(item, index) in projectStore.projects" 
        :key="item.id" 
        class="gallery-item" 
        :style="{ 
          backgroundColor: item.color || '#f0f0f0',
          backgroundImage: item.thumbnail ? `url(${item.thumbnail})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }"
        @click="handleItemClick(item)"
      >
        <div class="overlay">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useProjectStore } from '../stores/project'

const router = useRouter()
const projectStore = useProjectStore()

const handleItemClick = (item) => {
  if (item.path) {
    router.push(item.path)
  }
}
</script>



<style scoped lang="scss">
.section-container {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-desc {
  margin-bottom: 1.5rem;
  color: var(--text-tertiary);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  aspect-ratio: 4/3;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    
    .overlay {
      opacity: 1;
    }
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    
    p {
      margin: 0 1rem;
      font-size: 0.9rem;
      opacity: 0.8;
      text-align: center;
    }
  }
}
</style>
