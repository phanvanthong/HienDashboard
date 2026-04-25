<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Tổng quan</h1>
      <div class="header-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Right side: import button + date filter -->
      <div class="header-right">
        <ImportExcelButton />

        <!-- Date filter — shown for Tab1 and Tab2 -->
        <div v-if="activeTab === 'tab1' || activeTab === 'tab2'" class="header-filter">
        <span class="filter-label">Khoảng thời gian:</span>
        <div class="filter-group">
          <label class="filter-lbl">Từ tháng</label>
          <input type="month" v-model="inputFrom" class="month-input" :max="inputTo" />
        </div>
        <span class="filter-sep">—</span>
        <div class="filter-group">
          <label class="filter-lbl">Đến tháng</label>
          <input type="month" v-model="inputTo" class="month-input" :min="inputFrom" />
        </div>
        <button class="apply-btn" @click="applyFilter" :disabled="!isDirty">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 8h12M10 4l4 4-4 4"/>
          </svg>
          Áp dụng
        </button>
        <span class="filter-divider"></span>
        <span class="filter-count">{{ recordCount }} bản ghi</span>
        </div>
      </div>
    </div>

    <!-- Tab content -->
    <Tab1View v-if="activeTab === 'tab1'" :appliedFrom="appliedFrom" :appliedTo="appliedTo" @update:count="recordCount = $event" />
    <Tab2View v-else-if="activeTab === 'tab2'" :appliedFrom="appliedFrom" :appliedTo="appliedTo" @update:count="recordCount = $event" />

    <div v-else class="tab-placeholder">
      <div class="placeholder-inner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="ph-icon">
          <path d="M9 17v-2m3 2v-4m3 4v-6M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>{{ tabs.find(t => t.id === activeTab)?.label }} — Đang phát triển</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tab1View from './Tab1View.vue'
import Tab2View from './Tab2View.vue'
import ImportExcelButton from '../components/common/ImportExcelButton.vue'

const tabs = [
  { id: 'tab1', label: 'Tab1' },
  { id: 'tab2', label: 'Tab2' },
  { id: 'tab3', label: 'Tab3' },
]
const activeTab   = ref('tab1')
const recordCount = ref(0)

const inputFrom   = ref('2024-06')
const inputTo     = ref('2025-08')
const appliedFrom = ref('2024-06')
const appliedTo   = ref('2025-08')

const isDirty = computed(
  () => inputFrom.value !== appliedFrom.value || inputTo.value !== appliedTo.value
)

function applyFilter() {
  appliedFrom.value = inputFrom.value
  appliedTo.value   = inputTo.value
}
</script>

<style scoped>
.dashboard {
  padding: 12px 24px 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-md);
  padding: 8px 14px;
}

.filter-divider {
  width: 1px;
  height: 18px;
  background: var(--color-soft-border);
  flex-shrink: 0;
}

.filter-count {
  font-size: 12px;
  color: var(--color-secondary-gray);
  white-space: nowrap;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-near-black);
  white-space: nowrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-lbl {
  font-size: 12px;
  color: var(--color-secondary-gray);
  white-space: nowrap;
}

.month-input {
  font-family: var(--font);
  font-size: 13px;
  color: var(--color-near-black);
  background: var(--color-pale-gray);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}
.month-input:focus { border-color: var(--color-action-blue); }

.filter-sep {
  color: var(--color-mid-border);
  font-size: 16px;
}

.apply-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font);
  background: var(--color-action-blue);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  white-space: nowrap;
}
.apply-btn:hover:not(:disabled) { background: var(--color-link-blue); }
.apply-btn:disabled {
  background: var(--color-soft-border);
  color: var(--color-mid-border);
  cursor: default;
}
.apply-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-near-black);
  letter-spacing: -0.3px;
}

.header-tabs {
  display: flex;
  background: var(--color-pale-gray);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-md);
  padding: 3px;
  gap: 2px;
}

.tab-btn {
  padding: 5px 18px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--color-secondary-gray);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tab-btn.active {
  background: var(--color-white);
  color: var(--color-near-black);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Placeholder */
.tab-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-lg);
}

.placeholder-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--color-mid-border);
}

.ph-icon {
  width: 48px;
  height: 48px;
}

.placeholder-inner p {
  font-size: 14px;
  color: var(--color-secondary-gray);
}
</style>
