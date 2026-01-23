<template>
  <div class="story-event-node">
    <Handle type="target" position="top" style="opacity: 0" />
    <div class="event-card">
      <div class="event-name">{{ data.label }}</div>
      <div class="avatars" v-if="data.characters && data.characters.length">
        <div v-for="char in data.characters" :key="char.CharacterID" class="avatar">
           <img v-if="char.AvatarURL" :src="char.AvatarURL" :title="char.CharacterName" />
           <span v-else>{{ char.CharacterName[0] }}</span>
        </div>
      </div>
    </div>
    <Handle type="source" position="bottom" style="opacity: 0" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: {
    label: string
    characters?: Array<{
      CharacterID: string
      CharacterName: string
      AvatarURL?: string
    }>
  }
}>()
</script>

<style scoped>
.story-event-node {
  width: 104px; /* Matches EVENT_WIDTH in parent */
  text-align: center;
}

.event-card {
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  font-size: 11px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-name {
  font-weight: 600;
  margin-bottom: 4px;
  word-break: break-word;
}

.avatars {
  display: flex;
  justify-content: center;
  gap: -4px;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #eee;
  border: 1px solid white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #666;
}

.avatar img {
  width: 100%;
  height: 100%;
}
</style>
