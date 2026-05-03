<template>
  <div class="tab1">
    <!-- Row 1: KPI cards (left 50%) + 2 donuts (right 50%) -->
    <div class="row-1">
      <KpiSummaryCard
        :totalDtThucTe="totalDtThucTe"
        :totalRevenue="totalRevenue"
        :revByCategory="revByCategory"
        :totalSaleCount="totalSaleCount"
      />
      <div class="donut-pair">
        <RevenueRatioChart :totalRevenue="totalRevenue" />
        <RevenueByCNChart  :revByCNDtThucTe="revByCNDtThucTe" />
      </div>
    </div>

    <!-- Row 2: Orders by category (50%) + SAT/IELTS (25%) + Revenue by source (25%) -->
    <div class="row-mid">
      <OrdersByCategoryChart :revByCategory="revByCategory" />
      <div class="donut-pair-mid">
        <SatIeltsOrdersChart   :satIeltsOrders="satIeltsOrders" />
        <RevenueBySourceChart  :revBySource="revBySource" />
      </div>
    </div>

    <!-- Row 3: Team/CN bar + Sale ranking -->
    <div class="row-bot">
      <RevenueByTeamChart :revByTeam="revByTeam" :revByCN="revByCN" />
      <SaleRankingTable   :saleRanking="saleRanking" />
    </div>
  </div>
</template>

<script setup>
import { toRef, watch } from 'vue'
import { useRevenueData } from '../composables/useRevenueData.js'
import KpiSummaryCard        from '../components/tab1/KpiSummaryCard.vue'
import RevenueRatioChart     from '../components/tab1/RevenueRatioChart.vue'
import RevenueByCNChart      from '../components/tab1/RevenueByCNChart.vue'
import OrdersByCategoryChart from '../components/tab1/OrdersByCategoryChart.vue'
import SatIeltsOrdersChart   from '../components/tab1/SatIeltsOrdersChart.vue'
import RevenueBySourceChart  from '../components/tab1/RevenueBySourceChart.vue'
import RevenueByTeamChart    from '../components/tab1/RevenueByTeamChart.vue'
import SaleRankingTable      from '../components/tab1/SaleRankingTable.vue'

const props = defineProps({
  appliedFrom: { type: String, default: '2023-07' },
  appliedTo:   { type: String, default: '2025-08' },
})

const emit = defineEmits(['update:count'])

const { filtered, totalRevenue, totalDtThucTe, revByCategory, revByTeam, revByCN, revByCNDtThucTe, saleRanking, revBySource, satIeltsOrders, totalSaleCount } =
  useRevenueData(toRef(props, 'appliedFrom'), toRef(props, 'appliedTo'))

watch(() => filtered.value.length, n => emit('update:count', n), { immediate: true })
</script>

<style scoped>
.tab1 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow: hidden;
}

/* Each row takes equal 1/3 of available height */
.row-1, .row-mid, .row-bot {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Nested grids */
.donut-pair, .donut-pair-mid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  min-height: 0;
}

/* Fix: prevent min-content from breaking 1fr equality */
.row-1 > *, .row-mid > *, .row-bot > * { min-width: 0; }
.donut-pair > *, .donut-pair-mid > * { min-width: 0; }

/* Chart cards fill their grid cell */
:deep(.chart-card) { height: 100%; min-height: 0; overflow: hidden; }
:deep(.kpi-card)   { overflow: hidden; }
:deep(.chart-card-header) { flex-shrink: 0; }

/* Rows 1 & 2: chart-body (direct child of chart-card, no chart-scroll wrapper) fills remaining height */
.row-1 :deep(.chart-card > .chart-body),
.row-mid :deep(.chart-card > .chart-body) {
  flex: 1 !important;
  height: auto !important;
  min-height: 60px;
}

/* Row 3: RevenueByTeamChart — chart-scroll fills card; chart-body keeps inline pixel height → scrolls when overflowing */
.row-bot :deep(.chart-scroll) {
  flex: 1;
  max-height: none !important;
  min-height: 0;
  overflow-y: auto;
}

/* Row 3: sale ranking table fills card */
:deep(.table-card) { height: 100%; min-height: 0; overflow: hidden; }
:deep(.table-wrap) {
  flex: 1;
  max-height: none !important;
  min-height: 0;
  overflow-y: auto;
}

@media (max-width: 1100px) {
  .row-1 { grid-template-columns: 1fr; }
  .donut-pair { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 800px) {
  .tab1 { height: auto; overflow: visible; }
  .row-1, .row-mid, .row-bot {
    flex: none;
    grid-template-columns: 1fr;
    min-height: 320px;
  }
  .donut-pair, .donut-pair-mid { grid-template-columns: 1fr; }
  .row-1 :deep(.chart-card > .chart-body),
  .row-mid :deep(.chart-card > .chart-body) { min-height: 200px; }
}
</style>
