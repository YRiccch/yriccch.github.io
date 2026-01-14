<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Languages, Sun, Moon, Menu, X } from 'lucide-vue-next'

const { locale } = useI18n()

// Theme Logic
const isDark = ref(false)
const isMenuOpen = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const scrollToSection = (id) => {
  closeMenu() // Close menu when clicking a link
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  const element = document.getElementById(id)
  if (element) {
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - navbarHeight - 20 // Added extra 20px padding

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
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
    <!-- Desktop Navigation -->
    <div class="desktop-nav">
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.key">
          <a href="#" @click.prevent="scrollToSection(item.id)" class="nav-link">
            {{ $t(`nav.${item.key}`) }}
          </a>
        </li>
      </ul>

      <div class="nav-actions">
        <button @click="toggleTheme" class="icon-btn" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <Sun v-if="isDark" size="18" />
          <Moon v-else size="18" />
        </button>

        <button @click="toggleLanguage" class="lang-btn" title="Switch Language">
          <Languages size="18" />
          <span>{{ locale === 'en' ? '中文' : 'English' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Floating Navigation (Right Side) -->
    <div class="mobile-nav">
      <div class="mobile-actions">
        <button @click="toggleTheme" class="icon-btn-floating" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <Sun v-if="isDark" size="16" />
          <Moon v-else size="16" />
        </button>
        <button @click="toggleLanguage" class="lang-btn-floating" title="Switch Language">
          <Languages size="16" />
          <span>{{ locale === 'en' ? '中' : 'En' }}</span>
        </button>
      </div>

      <div class="mobile-menu">
         <a v-for="item in navItems" :key="item.key" href="#" @click.prevent="scrollToSection(item.id)" class="nav-pill">
            {{ $t(`nav.${item.key}`) }}
         </a>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
/* Desktop Styles (Default) */
.navbar {
  z-index: 100;
  position: sticky; /* Moved sticky to root for better behavior */
  top: 0;
}

.desktop-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  /* position: sticky;  <-- Removed from here */
  /* top: 0;            <-- Removed from here */
  background-color: var(--navbar-bg);
  backdrop-filter: blur(5px);
  transition: background-color 0.3s, border-color 0.3s;
}

.mobile-nav {
  display: none;
}

.nav-list {
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  
  .nav-link {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-secondary);
    position: relative;
    padding: 0.5rem 0;
    transition: color 0.3s;
    text-decoration: none;
    
    &:hover {
      color: var(--primary-color);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn, .lang-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;

  &:hover {
    background-color: var(--hover-bg);
    color: var(--text-primary);
  }
}

.icon-btn {
  padding: 0.4rem;
}

.lang-btn {
  padding: 0.4rem 0.8rem;
  gap: 0.5rem;
  font-size: 0.9rem;
}

/* Mobile Styles (< 900px) */
@media (max-width: 900px) {
  .navbar {
    position: static; /* Reset sticky for mobile, let .mobile-nav handle it */
  }

  .desktop-nav {
    display: none;
  }
  
  .mobile-nav {
    display: flex;
    flex-direction: column;
    position: sticky; /* Changed from fixed to sticky to follow content flow */
    top: 2rem;
    margin-left: 1rem; /* Add spacing from content */
    gap: 1.5rem;
    align-items: flex-end;
    z-index: 99;
  }

  .mobile-actions {
    display: flex;
    gap: 0.5rem;
  }

  .icon-btn-floating, .lang-btn-floating {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 6px 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    color: var(--text-secondary);
    font-size: 0.8rem;
    cursor: pointer;
    
    &:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: flex-end;
  }

  .nav-pill {
    background-color: var(--card-bg);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border: 1px solid var(--border-color);
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
      color: var(--primary-color);
      transform: translateX(-4px);
      border-color: var(--primary-color);
    }
  }
}
</style>
