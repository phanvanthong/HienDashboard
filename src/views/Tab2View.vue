<template>
  <div class="tab2">
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

    <!-- Row 1: Tổng doanh thu + Tỷ lệ doanh thu -->
    <div class="charts-row">
      <TotalRevenueChart :totalRevenue="totalRevenue" />
      <RevenueRatioChart :totalRevenue="totalRevenue" />
    </div>

    <!-- Row 2: Biến động DT loại hình + Biến động SL đơn hàng -->
    <div class="charts-row">
      <RevenueByCategoryChart
        :revByCategory="revByCategory"
        title="Biến động doanh thu theo phân loại học sinh"
        subtitle="Đăng ký mới vs Hoàn thiện · Doanh thu thực tế"
      />
      <OrdersByCategoryChart
        :revByCategory="revByCategory"
        title="Biến động số lượng đơn hàng theo phân loại học sinh"
        subtitle="Đăng ký mới vs Hoàn thiện · Số bản ghi"
      />
    </div>

    <!-- Row 3: Biến động DT team + Biến động sale hoạt động -->
    <div class="charts-row">
      <RevenueByTeamChart :revByTeam="revByTeam" :revByCN="revByCN" />
      <ActiveSalesChart   :activeSalesByMonth="activeSalesByMonth" />
    </div>

    <!-- Row 4: Doanh thu theo nguồn -->
    <div class="charts-row charts-row-1">
      <RevenueBySourceChart :revBySource="revBySource" />
    </div>

    <!-- Row 5: Phân tích tỷ lệ DT & SL đơn từng sale (full width) -->
    <SaleAnalysisTable :saleAnalysis="saleAnalysis" />

    <!-- Row 6: Xếp hạng doanh số sale (full width) -->
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
import SaleAnalysisTable      from '../components/tab2/SaleAnalysisTable.vue'
import ActiveSalesChart       from '../components/tab2/ActiveSalesChart.vue'

const inputFrom = ref('2023-07')
const inputTo   = ref('2025-08')
const appliedFrom = ref('2023-07')
const appliedTo   = ref('2025-08')

const isDirty = computed(
  () => inputFrom.value !== appliedFrom.value || inputTo.value !== appliedTo.value
)

function applyFilter() {
  appliedFrom.value = inputFrom.value
  appliedTo.value   = inputTo.value
}

const {
  filtered, totalRevenue, revByCategory, revByTeam, revByCN,
  saleRanking, revBySource, saleAnalysis, activeSalesByMonth,
} = useRevenueData(appliedFrom, appliedTo)
</script>

<style scoped>
.tab2 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.charts-row-1 {
  grid-template-columns: 1fr;
}

@media (max-width: 900px) {
  .charts-row { grid-template-columns: 1fr; }
}
</style>
