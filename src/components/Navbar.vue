<script setup>
import { useI18n } from 'vue-i18n'
import { Languages } from 'lucide-vue-next'

const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const navItems = [
  { key: 'homepage', id: 'home' },
  { key: 'about', id: 'about' },
  { key: 'news', id: 'news' },
  { key: 'publications', id: 'publications' },
  { key: 'gallery', id: 'gallery' }
]
</script>

<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.key">
        <a href="#" @click.prevent="scrollToSection(item.id)" class="nav-link">
          {{ $t(`nav.${item.key}`) }}
        </a>
      </li>
    </ul>

    <button @click="toggleLanguage" class="lang-btn" title="Switch Language">
      <Languages size="18" />
      <span>{{ locale === 'en' ? '中文' : 'English' }}</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  background-color: rgba(249, 249, 249, 0.95);
  backdrop-filter: blur(5px);
  z-index: 100;
}

.nav-list {
  display: flex;
  gap: 1.5rem;
  
  .nav-link {
    font-size: 0.95rem;
    font-weight: 500;
    color: #555;
    position: relative;
    padding: 0.5rem 0;
    
    &:hover {
      color: #0056b3;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #0056b3;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #ddd;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  transition: all 0.2s;

  &:hover {
    background-color: #eee;
    color: #000;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    position: static;
  }
  
  .nav-list {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
