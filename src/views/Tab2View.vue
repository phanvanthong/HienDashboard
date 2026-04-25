<template>
  <div class="tab2">
    <!-- Row 1: Total Revenue + Revenue by Loai -->
    <div class="row-2col">
      <MonthlyRevenueChart        :byMonth="byMonth" />
      <MonthlyByLoaiChart         :byMonth="byMonth" />
    </div>

    <!-- Row 2: Orders count + Orders by Loai -->
    <div class="row-2col">
      <MonthlyOrdersChart         :byMonth="byMonth" />
      <MonthlyByOrderLoaiChart    :byMonth="byMonth" />
    </div>

    <!-- Row 3: By Team + Active Sales -->
    <div class="row-2col">
      <MonthlyByTeamChart         :byMonth="byMonth" :filtered="filtered" />
      <ActiveSalesMonthlyChart    :byMonth="byMonth" />
    </div>
  </div>
</template>

<script setup>
import { toRef, watch } from 'vue'
import { useRevenueData } from '../composables/useRevenueData.js'
import MonthlyRevenueChart        from '../components/tab2/MonthlyRevenueChart.vue'
import MonthlyOrdersChart         from '../components/tab2/MonthlyOrdersChart.vue'
import MonthlyByLoaiChart         from '../components/tab2/MonthlyByLoaiChart.vue'
import MonthlyByOrderLoaiChart    from '../components/tab2/MonthlyByOrderLoaiChart.vue'
import MonthlyByTeamChart         from '../components/tab2/MonthlyByTeamChart.vue'
import ActiveSalesMonthlyChart    from '../components/tab2/ActiveSalesMonthlyChart.vue'

const props = defineProps({
  appliedFrom: { type: String, default: '2023-07' },
  appliedTo:   { type: String, default: '2025-08' },
})

const emit = defineEmits(['update:count'])

const { filtered, byMonth } =
  useRevenueData(toRef(props, 'appliedFrom'), toRef(props, 'appliedTo'))

watch(() => filtered.value.length, n => emit('update:count', n), { immediate: true })
</script>

<style scoped>
/* tab2 fills exactly the remaining viewport height */
.tab2 {
  height: calc(100vh - 82px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* each row takes equal share of available height */
.row-2col {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* card fills grid cell */
.row-2col :deep(.chart-card) {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

/* chart body fills whatever height is left inside the card */
.row-2col :deep(.chart-body) {
  flex: 1 !important;
  height: auto !important;
  min-height: 80px !important;
}

@media (max-width: 900px) {
  .tab2 { height: auto; overflow: visible; }
  .row-2col { flex: none; grid-template-columns: 1fr; }
  .row-2col :deep(.chart-body) {
    flex: none !important;
    height: calc(33vh - 140px) !important;
  }
}
</style>
