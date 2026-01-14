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
        <div class="content-wrapper">
          <Navbar />
          
          <div class="sections-list">
            <SectionAbout />
            <SectionNews />
            <SectionPubs />
            <SectionGallery />
            
            <footer class="footer">
              <p>&copy; {{ new Date().getFullYear() }} Ruiqi Yu. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  min-height: 100vh;
}

.layout-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 4rem;
  padding-top: 2rem;
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
  padding-top: 0;
  padding-bottom: 4rem;
}

.footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-quaternary);
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .sidebar-column {
    order: -1;
  }
  
  .app-container {
    padding: 0 1rem;
    padding-right: 0; /* Reset right padding as we will use flex layout */
  }

  /* Mobile Layout: Side-by-Side (Content Left, Navbar Right) */
  .content-wrapper {
    display: flex;
    flex-direction: row;
    position: relative;
    /* Ensure content takes available space */
  }

  /* Sections List on the Left */
  .sections-list {
    flex: 1;
    min-width: 0; /* Prevent overflow */
    order: 1;
  }
  
  /* Navbar on the Right */
  .content-wrapper > :first-child { /* Navbar */
    flex-shrink: 0;
    order: 2;
    /* Navbar root will stretch to full height of content-wrapper */
  }
}

/* Restore flat layout for Desktop */
@media (min-width: 901px) {
  .content-wrapper,
  .sections-list {
    display: contents;
  }
}

@media (max-width: 600px) {
  .layout-grid {
    gap: 1.5rem;
  }
  
  .app-container {
     padding-right: 0;
  }
  
  .footer {
    margin-top: 3rem;
  }
}
</style>
