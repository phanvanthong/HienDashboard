<template>
  <div class="chart-card">
    <div class="chart-card-header" :class="{ column: headerColumn }">
      <div>
        <h3 class="chart-title">
          {{ title }}<span v-if="total" class="chart-title-total"> — Tổng: {{ total }}</span>
        </h3>
        <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
      </div>
      <slot name="control" />
    </div>
    <div
      v-if="maxHeight"
      class="chart-scroll"
      :style="{ maxHeight: maxHeight + 'px' }"
    >
      <div class="chart-body" :style="{ height: height + 'px' }">
        <slot />
      </div>
    </div>
    <div v-else class="chart-body" :style="{ height: height + 'px' }">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  total: { type: String, default: '' },
  height: { type: Number, default: 280 },
  maxHeight: { type: Number, default: 0 },
  headerColumn: { type: Boolean, default: false },
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
  gap: 8px;
}

.chart-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
}

.chart-card-header.column {
  flex-direction: column;
  gap: 8px;
}

.chart-card-header > div:first-child {
  flex-shrink: 0;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-near-black);
  letter-spacing: -0.15px;
}

.chart-title-total {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--color-secondary-gray);
  letter-spacing: 0;
}

.chart-subtitle {
  font-size: 11.5px;
  color: var(--color-secondary-gray);
  margin-top: 2px;
}

.chart-scroll {
  overflow-y: auto;
  overflow-x: hidden;
}

.chart-body {
  position: relative;
  width: 100%;
}
</style>
