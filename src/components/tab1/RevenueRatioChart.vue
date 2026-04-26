<!-- Doanh thu từng loại hình (donut) - hiện cả số tiền và % -->
<template>
  <ChartCard title="Doanh thu từng loại hình" subtitle="Doanh thu: DT sau quà tặng, Loại hình" :height="230">
    <div class="donut-layout">
      <div class="donut-wrap">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="donut-center">
          <span class="donut-total">{{ fmtShort(totalSum) }}</span>
        </div>
      </div>
      <div class="legend">
        <div v-for="(item, i) in legendItems" :key="i" class="legend-row">
          <span class="dot" :style="{ background: item.color }"></span>
          <span class="lbl">{{ item.label }}</span>
          <span class="val-pct">{{ fmtShort(item.rawVal) }} — {{ item.pct }}%</span>
        </div>
      </div>
    </div>
  </ChartCard>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import ChartCard from './ChartCard.vue'
import { LOAI_HINH, LOAI_LABEL, LOAI_COLORS } from '../../composables/useRevenueData.js'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({ totalRevenue: Object })


const totalSum = computed(() =>
  LOAI_HINH.reduce((s, l) => s + (props.totalRevenue?.[l]?.dtSauQua || 0), 0)
)

const legendItems = computed(() =>
  LOAI_HINH.map((l) => {
    const val = props.totalRevenue?.[l]?.dtSauQua || 0
    const pct = totalSum.value > 0 ? ((val / totalSum.value) * 100).toFixed(1) : '0.0'
    return { label: LOAI_LABEL[l], color: LOAI_COLORS[l], pct, rawVal: val }
  }).filter((i) => parseFloat(i.pct) > 0)
)

const chartData = computed(() => ({
  labels: LOAI_HINH.map((l) => LOAI_LABEL[l]),
  datasets: [{
    data: LOAI_HINH.map((l) => props.totalRevenue?.[l]?.dtSauQua || 0),
    backgroundColor: LOAI_HINH.map((l) => LOAI_COLORS[l]),
    borderWidth: 2,
    borderColor: '#fff',
    hoverOffset: 4,
  }],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    datalabels: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: {
        label: (c) => {
          const pct = totalSum.value > 0 ? ((c.raw / totalSum.value) * 100).toFixed(1) : 0
          return ` ${fmtVND(c.raw)} (${pct}%)`
        },
      },
    },
  },
}))
</script>

<style scoped>
.donut-layout { display: flex; align-items: center; gap: 16px; height: 100%; }
.donut-wrap   { position: relative; width: 130px; height: 130px; flex-shrink: 0; }
.donut-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.donut-total  { font-size: 11px; font-weight: 700; color: var(--color-near-black); text-align: center; line-height: 1.2; }
.legend       { flex: 1; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }
.legend-row   { display: flex; align-items: center; gap: 6px; font-size: 11.5px; }
.dot          { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lbl          { flex: 1; color: var(--color-near-black); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.val-pct      { font-weight: 600; color: var(--color-near-black); white-space: nowrap; flex-shrink: 0; }
</style>
