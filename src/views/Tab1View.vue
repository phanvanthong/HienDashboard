<template>
  <div class="tab1">
    <!-- Date Filter -->
    <div class="date-filter-bar">
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
      <span class="filter-count">{{ filtered.length }} bản ghi</span>
    </div>

    <!-- Row 1: Chart 1 + Chart 2 -->
    <div class="charts-row">
      <TotalRevenueChart :totalRevenue="totalRevenue" />
      <RevenueRatioChart :totalRevenue="totalRevenue" />
    </div>

    <!-- Row 2: Chart 3 + Chart 4 -->
    <div class="charts-row">
      <RevenueByCategoryChart :revByCategory="revByCategory" />
      <OrdersByCategoryChart  :revByCategory="revByCategory" />
    </div>

    <!-- Row 3: Chart 5 + Chart 7 -->
    <div class="charts-row">
      <RevenueByTeamChart :revByTeam="revByTeam" :revByCN="revByCN" />
      <RevenueBySourceChart :revBySource="revBySource" />
    </div>

    <!-- Row 4: Chart 6 — Sale Ranking Table (full width) -->
    <SaleRankingTable :saleRanking="saleRanking" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRevenueData } from '../composables/useRevenueData.js'
import TotalRevenueChart      from '../components/tab1/TotalRevenueChart.vue'
import RevenueRatioChart      from '../components/tab1/RevenueRatioChart.vue'
import RevenueByCategoryChart from '../components/tab1/RevenueByCategoryChart.vue'
import OrdersByCategoryChart  from '../components/tab1/OrdersByCategoryChart.vue'
import RevenueByTeamChart     from '../components/tab1/RevenueByTeamChart.vue'
import RevenueBySourceChart   from '../components/tab1/RevenueBySourceChart.vue'
import SaleRankingTable       from '../components/tab1/SaleRankingTable.vue'

// Input state — what the user is typing/picking
const inputFrom = ref('2023-07')
const inputTo   = ref('2025-08')

// Applied state — what the charts actually use (only updates on "Áp dụng")
const appliedFrom = ref('2023-07')
const appliedTo   = ref('2025-08')

// Show button as active when inputs differ from applied values
const isDirty = computed(
  () => inputFrom.value !== appliedFrom.value || inputTo.value !== appliedTo.value
)

function applyFilter() {
  appliedFrom.value = inputFrom.value
  appliedTo.value   = inputTo.value
}

const { filtered, totalRevenue, revByCategory, revByTeam, revByCN, saleRanking, revBySource } =
  useRevenueData(appliedFrom, appliedTo)
</script>

<style scoped>
.tab1 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Date filter bar */
.date-filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  flex-wrap: wrap;
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

/* Apply button */
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

.filter-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-secondary-gray);
  white-space: nowrap;
}

/* Charts grid */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .charts-row { grid-template-columns: 1fr; }
}
</style>
