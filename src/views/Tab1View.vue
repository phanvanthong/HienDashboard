<template>
  <div class="tab1">
    <!-- Row 1: Tổng DT (span 2) + 2 donut (mỗi cái 1 cột) -->
    <div class="row-top">
      <TotalRevenueChart class="span2" :totalRevenue="totalRevenue" />
      <RevenueRatioChart :totalRevenue="totalRevenue" />
      <RevenueBySourceChart :revBySource="revBySource" />
    </div>

    <!-- Row 2: 2 biểu đồ danh mục -->
    <div class="row-mid">
      <RevenueByCategoryChart :revByCategory="revByCategory" />
      <OrdersByCategoryChart  :revByCategory="revByCategory" />
    </div>

    <!-- Row 3: Team/CN + Bảng xếp hạng -->
    <div class="row-bot">
      <RevenueByTeamChart :revByTeam="revByTeam" :revByCN="revByCN" />
      <SaleRankingTable :saleRanking="saleRanking" />
    </div>
  </div>
</template>

<script setup>
import { toRef, watch } from 'vue'
import { useRevenueData } from '../composables/useRevenueData.js'
import TotalRevenueChart      from '../components/tab1/TotalRevenueChart.vue'
import RevenueRatioChart      from '../components/tab1/RevenueRatioChart.vue'
import RevenueByCategoryChart from '../components/tab1/RevenueByCategoryChart.vue'
import OrdersByCategoryChart  from '../components/tab1/OrdersByCategoryChart.vue'
import RevenueByTeamChart     from '../components/tab1/RevenueByTeamChart.vue'
import RevenueBySourceChart   from '../components/tab1/RevenueBySourceChart.vue'
import SaleRankingTable       from '../components/tab1/SaleRankingTable.vue'

const props = defineProps({
  appliedFrom: { type: String, default: '2023-07' },
  appliedTo:   { type: String, default: '2025-08' },
})

const emit = defineEmits(['update:count'])

const { filtered, totalRevenue, revByCategory, revByTeam, revByCN, saleRanking, revBySource } =
  useRevenueData(toRef(props, 'appliedFrom'), toRef(props, 'appliedTo'))

watch(() => filtered.value.length, n => emit('update:count', n), { immediate: true })
</script>

<style scoped>
.tab1 {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Row 1: 4 cột đều nhau, chart đầu span 2 */
.row-top {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
}

.row-top .span2 {
  grid-column: span 2;
}

.row-top :deep(.chart-body) {
  height: calc(33vh - 140px) !important;
  min-height: 130px !important;
}

/* Row 2: 2 biểu đồ danh mục */
.row-mid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.row-mid :deep(.chart-body) {
  height: calc(33vh - 140px) !important;
  min-height: 120px !important;
}

/* Row 3: team + bảng */
.row-bot {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.row-bot :deep(.chart-scroll) {
  max-height: calc(33vh - 140px) !important;
  min-height: 110px !important;
}

.row-bot :deep(.table-wrap) {
  max-height: calc(33vh - 100px);
  min-height: 110px;
}

@media (max-width: 1100px) {
  .row-top { grid-template-columns: 1fr 1fr; }
  .row-top .span2 { grid-column: 1 / -1; }
}

@media (max-width: 800px) {
  .row-top, .row-mid, .row-bot { grid-template-columns: 1fr; }
  .row-top .span2 { grid-column: auto; }
}
</style>
