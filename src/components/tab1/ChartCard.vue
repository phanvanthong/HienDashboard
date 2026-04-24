<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <div>
        <h3 class="chart-title">{{ title }}</h3>
        <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
      </div>
      <slot name="control" />
    </div>
    <div class="chart-body" :style="{ height: height + 'px' }">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  height: { type: Number, default: 280 },
})
</script>

<style scoped>
.chart-card {
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chart-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-near-black);
  letter-spacing: -0.15px;
}

.chart-subtitle {
  font-size: 11.5px;
  color: var(--color-secondary-gray);
  margin-top: 2px;
}

.chart-body {
  position: relative;
  width: 100%;
}
</style>
