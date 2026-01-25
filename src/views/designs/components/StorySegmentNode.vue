<template>
  <div class="story-segment-node-container">
    <!-- Visual Bar (Background Image) -->
    <div class="segment-visual">
      <img v-if="data.fillImageURL" :src="data.fillImageURL" class="bg-img" />
      <div v-else class="fallback-bg"></div>
      
      <!-- Handles inside the visual bar -->
      <Handle type="source" :position="Position.Right" style="top: 50%; right: 0; transform: translate(50%, -50%)" />
      <Handle type="target" :position="Position.Left" style="top: 50%; left: 0; transform: translate(-50%, -50%)" />
    </div>

    <!-- Footer Label -->
    <div class="segment-footer">
      <div class="segment-title">{{ data.locationName || data.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: {
    label: string
    locationName?: string
    fillImageURL?: string
  }
}>()
</script>

<style scoped>
.story-segment-node-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.segment-visual {
  width: 100%;
  height: 100%;
  border-radius: 999px; /* Pill shape */
  overflow: hidden;
  position: relative;
  background: #2a2a2a;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  transition: transform 0.3s ease;
}

.story-segment-node-container:hover .bg-img {
  transform: scale(1.05);
}

.fallback-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #333 0%, #111 100%);
}

.segment-footer {
  position: absolute;
  top: 100%;
  left: 40px; /* Align with the start of curve somewhat, or just left aligned with padding */
  margin-top: 12px;
  pointer-events: none; /* Let clicks pass through label area if needed */
}

.segment-title {
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 32px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  /* Metallic/Gradient Text Effect */
  background: linear-gradient(to bottom, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #fff; /* Fallback */
  
  /* Text Shadow for depth */
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  
  /* Skew for dynamic look */
  transform: skewX(-10deg);
}

/* Customize Handle Styles */
:deep(.vue-flow__handle) {
  width: 12px;
  height: 12px;
  background: #ff5252;
  border: 2px solid white;
}
</style>
