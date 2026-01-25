<template>
  <div class="story-group-node">
    <div class="group-header">
      <span class="tag emotion" v-if="data.emotion">{{ data.emotion }}</span>
      <span class="tag purpose" v-if="data.purpose">{{ data.purpose }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    emotion?: string
    purpose?: string
  }
}>()
</script>

<style scoped>
.story-group-node {
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.story-group-node:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
}

.group-header {
  position: absolute;
  top: -24px;
  left: 0;
  display: flex;
  gap: 8px;
  white-space: nowrap;
}

.tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.tag.emotion {
  background: #ff5252; /* Red */
}

.tag.purpose {
  background: #448aff; /* Blue */
}
</style>