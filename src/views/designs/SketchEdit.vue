<template>
  <div class="sketch-edit-container">
    <div class="controls-overlay">
      <el-button @click="$router.push('/')" size="small">Back</el-button>
      <div class="info-panel">
        <h3>Sketch Camera Control</h3>
        <p>This feature is under development.</p>
        <p>Sketch functionality coming soon...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sketch-edit-container {
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.controls-overlay {
  text-align: center;
}
</style>