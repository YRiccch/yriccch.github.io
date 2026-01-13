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
        <p class="interests-text" v-html="$t('about.research_interests').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')"></p>
      </div>

      <p class="tech-stack">
        <b>{{ $t('about.tech_stack') }}</b>
      </p>
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
  color: #222;
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
}

.interests-container {
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #444;
  }
  
  .interests-text {
    font-size: 1rem;
    line-height: 1.5;
    color: #333;
  }
}

.tech-stack {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.job-seeking {
  color: #d32f2f;
  font-weight: 500;
  margin-top: 1rem;
}
</style>
