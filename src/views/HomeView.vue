<script setup>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import SectionAbout from '../components/SectionAbout.vue'
import SectionNews from '../components/SectionNews.vue'
import SectionPubs from '../components/SectionPubs.vue'  
import SectionGallery from '../components/SectionGallery.vue'
</script>

<template>
  <div class="app-container">
    <div class="layout-grid">
      <div class="sidebar-column">
        <Sidebar />
      </div>
      
      <main class="main-content">
        <Navbar />
        <SectionAbout />
        <SectionNews />
        <SectionPubs />
        <SectionGallery />
        
        <footer class="footer">
          <p>&copy; {{ new Date().getFullYear() }} Ruiqi Yu. All rights reserved.</p>
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.layout-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 4rem;
  min-height: 100vh;
}

.sidebar-column {
  position: relative;
}

// Sticky Sidebar for desktop
@media (min-width: 901px) {
  .sidebar-column {
    aside {
      position: sticky;
      top: 2rem;
    }
  }
}

.main-content {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
  text-align: center;
  color: #888;
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .sidebar-column {
    order: -1; // Keep sidebar on top or move it? Usually top for mobile
  }
  
  .app-container {
    padding: 0 1rem;
  }
}
</style>
