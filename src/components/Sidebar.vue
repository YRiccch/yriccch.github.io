<script setup>
import { Mail, MapPin, Github, Linkedin, GraduationCap } from 'lucide-vue-next'
</script>

<template>
  <aside class="sidebar">
    <div class="profile-container">
      <div class="avatar-wrapper">
        <img src="@/assets/img/myPhoto1.jpg" alt="Ruiqi Yu" class="avatar" />
      </div>
      
      <h1 class="name">{{ $t('sidebar.name') }}</h1>
      <p class="role">{{ $t('sidebar.role') }}</p>
      <p class="affiliation">{{ $t('sidebar.affiliation') }}</p>
      
      <div class="contact-info">
        <div class="item">
          <Mail size="16" />
          <a :href="'mailto:' + $t('sidebar.email')">{{ $t('sidebar.email') }}</a>
        </div>
        <div class="item">
          <MapPin size="16" />
          <span>{{ $t('sidebar.location') }}</span>
        </div>
      </div>

      <div class="social-links">
        <a href="https://github.com/YRiccch" target="_blank" class="social-item">
          <Github size="20" />
          <span>{{ $t('sidebar.github') }}</span>
        </a>
         <a href="#" target="_blank" class="social-item">
          <GraduationCap size="20" />
          <span>{{ $t('sidebar.orcid') }}</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  width: 100%;
  padding: 2rem 0;
  
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar-wrapper {
    width: 220px;
    height: 300px;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background-color: var(--hover-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .name {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }

  .role {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin: 0 0 0.25rem 0;
  }

  .affiliation {
    font-size: 1rem;
    color: var(--primary-color); // Academic blue
    margin: 0 0 1.5rem 0;
    font-weight: 500;
  }

  .contact-info {
    margin-bottom: 1.5rem;
    
    .item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      
      a:hover {
        color: var(--primary-color);
        text-decoration: underline;
      }
    }
  }

  .social-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .social-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.95rem;
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
}
</style>
