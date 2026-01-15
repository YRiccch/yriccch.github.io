<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section id="about" class="section-container">
    <h2 class="section-title">{{ $t('about.title') }}</h2>
    
    <div class="content">
      <p class="intro-text" v-html="$t('about.intro').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')"></p>
      
      <div class="interests-container">
        <h3>Research Interests</h3>
        <div class="interests-icons">
          <div class="interest-item">
            <img src="@/assets/img/DataVisualization.svg" alt="Data Visualization" />
            <span>Data Visualization & Analysis</span>
          </div>
          <div class="interest-item">
            <img src="@/assets/img/HCI.svg" alt="Human-Computer Interaction" />
            <span>Human-Computer Interaction</span>
          </div>
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
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.interests-container {
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  .interests-icons {
    display: flex;
    gap: 4rem; /* Increased gap for larger icons */
    flex-wrap: wrap;
    justify-content: center; /* Center the icons */

    .interest-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      
      img {
        height: 120px; /* Increased size from 60px */
        width: auto;
        transition: transform 0.3s;
      }
      
      span {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-secondary);
      }

      &:hover img {
        transform: scale(1.1);
      }
    }
  }
}

.tech-stack {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.job-seeking {
  color: #ef5350; /* Slightly lighter red for better visibility in dark mode, or could use var */
  font-weight: 500;
  margin-top: 1rem;
}
</style>
