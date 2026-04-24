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
    </div>

    <!-- Tab content -->
    <Tab1View v-if="activeTab === 'tab1'" />
    <Tab2View v-else-if="activeTab === 'tab2'" />

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
import { ref } from 'vue'
import Tab1View from './Tab1View.vue'
import Tab2View from './Tab2View.vue'

const tabs = [
  { id: 'tab1', label: 'Tab1' },
  { id: 'tab2', label: 'Tab2' },
  { id: 'tab3', label: 'Tab3' },
]
const activeTab = ref('tab1')
</script>

<style scoped>
.dashboard {
  padding: 20px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
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
