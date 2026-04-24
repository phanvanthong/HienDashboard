<template>
  <div class="stat-card">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <select class="period-select">
        <option v-for="opt in periods" :key="opt">{{ opt }}</option>
      </select>
    </div>

    <!-- Type: total — shows icon + large number -->
    <div v-if="type === 'total'" class="card-body-total">
      <div class="total-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>
      <div class="total-value">{{ formatNumber(value) }}</div>
    </div>

    <!-- Type: change — shows value + trend + previous -->
    <div v-else class="card-body-change">
      <div class="change-row">
        <span class="change-value">{{ formatNumber(value) }}</span>
        <span class="change-pct" :class="pctClass">{{ pct }}</span>
      </div>
      <div class="prev-value">Tuần trước: {{ formatNumber(prevValue) }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  type: { type: String, default: 'change' }, // 'total' | 'change'
  value: { type: Number, default: 0 },
  pct: { type: String, default: '0.0%' },
  prevValue: { type: Number, default: 0 },
  periods: { type: Array, default: () => ['Tuần này'] },
})

const formatNumber = (n) => new Intl.NumberFormat('vi-VN').format(n)

const pctClass = computed(() => {
  const num = parseFloat(props.pct)
  if (num > 0) return 'pct-up'
  if (num < 0) return 'pct-down'
  return 'pct-neutral'
})
</script>

<style scoped>
.stat-card {
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-lg);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-near-black);
}

.period-select {
  font-size: 12px;
  color: var(--color-near-black);
  background: var(--color-pale-gray);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  padding: 3px 22px 3px 8px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236e6e73' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
}

/* Total type */
.card-body-total {
  display: flex;
  align-items: center;
  gap: 14px;
}

.total-icon {
  width: 48px;
  height: 48px;
  background: #e8f0fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.total-icon svg {
  width: 26px;
  height: 26px;
  color: var(--color-action-blue);
}

.total-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-near-black);
  letter-spacing: -0.5px;
  line-height: 1;
}

/* Change type */
.card-body-change {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.change-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.change-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-near-black);
  letter-spacing: -0.5px;
  line-height: 1;
}

.change-pct {
  font-size: 13px;
  font-weight: 500;
}

.pct-up    { color: #34c759; }
.pct-down  { color: #ff3b30; }
.pct-neutral { color: var(--color-secondary-gray); }

.prev-value {
  font-size: 12px;
  color: var(--color-secondary-gray);
}
</style>
