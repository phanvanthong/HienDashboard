<template>
  <div class="tab1">
    <!-- Row 1: KPI cards (left 50%) + 2 donuts (right 50%) -->
    <div class="row-1">
      <KpiSummaryCard
        :totalDtThucTe="totalDtThucTe"
        :totalRevenue="totalRevenue"
        :revByCategory="revByCategory"
      />
      <div class="donut-pair">
        <RevenueRatioChart :totalRevenue="totalRevenue" />
        <RevenueByCNChart  :revByCNDtThucTe="revByCNDtThucTe" />
      </div>
    </div>

    <!-- Row 2: Orders by category (50%) + SAT/IELTS (25%) + Revenue by source (25%) -->
    <div class="row-mid">
      <OrdersByCategoryChart :revByCategory="revByCategory" />
      <SatIeltsOrdersChart   :satIeltsOrders="satIeltsOrders" />
      <RevenueBySourceChart  :revBySource="revBySource" />
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

const { filtered, totalRevenue, totalDtThucTe, revByCategory, revByTeam, revByCN, revByCNDtThucTe, saleRanking, revBySource, satIeltsOrders } =
  useRevenueData(toRef(props, 'appliedFrom'), toRef(props, 'appliedTo'))

watch(() => filtered.value.length, n => emit('update:count', n), { immediate: true })
</script>

<style scoped>
.tab1 {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Row 1: equal halves */
.row-1 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  min-height: calc(33vh - 40px);
}

/* Right half of row 1: 2 donuts side by side */
.donut-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.donut-pair :deep(.chart-body) {
  height: calc(33vh - 140px) !important;
  min-height: 120px !important;
}

/* Row 2: OrdersByCategory (50%) + SAT/IELTS (25%) + BySource (25%) */
.row-mid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
}

.row-mid :deep(.chart-body) {
  height: calc(33vh - 140px) !important;
  min-height: 120px !important;
}

/* Row 3 */
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
  .row-1 { grid-template-columns: 1fr; }
  .donut-pair { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 800px) {
  .row-1, .row-mid, .row-bot { grid-template-columns: 1fr; }
  .donut-pair { grid-template-columns: 1fr; }
}
</style>
