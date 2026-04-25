<!-- Chart 1: Tổng doanh thu (stacked bar: Quà Tặng + Doanh thu sau quà tặng) by Loại hình -->
<template>
  <ChartCard title="Tổng doanh thu" subtitle="Tổng doanh thu: Quà tặng, DT sau quà tặng" :total="fmtShort(grandTotal)">
    <template #control>
      <div class="chart-legend">
        <span class="legend-item">
          <i style="background:#ff9500"></i>Quà Tặng
          <span class="legend-total">{{ fmtShort(totalQt) }}</span>
        </span>
        <span class="legend-item">
          <i style="background:#0071e3"></i>DT sau quà tặng
          <span class="legend-total">{{ fmtShort(totalDt) }}</span>
        </span>
      </div>
    </template>
    <Bar :data="chartData" :options="chartOptions" :plugins="[stackPlugin]" />
  </ChartCard>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartCard from './ChartCard.vue'
import { stackTotalPlugin } from '../../plugins/stackTotalPlugin.js'
import { LOAI_HINH, LOAI_LABEL } from '../../composables/useRevenueData.js'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({ totalRevenue: Object })
const stackPlugin = stackTotalPlugin

const labels = LOAI_HINH.map((l) => LOAI_LABEL[l])

const totalQt  = computed(() => LOAI_HINH.reduce((s, l) => s + (props.totalRevenue?.[l]?.quaTang  || 0), 0))
const totalDt  = computed(() => LOAI_HINH.reduce((s, l) => s + (props.totalRevenue?.[l]?.dtSauQua || 0), 0))
const grandTotal = computed(() => totalQt.value + totalDt.value)

const chartData = computed(() => {
  const quaTang  = LOAI_HINH.map((l) => props.totalRevenue?.[l]?.quaTang  || 0)
  const dtSauQua = LOAI_HINH.map((l) => props.totalRevenue?.[l]?.dtSauQua || 0)
  return {
    labels,
    datasets: [
      {
        label: 'Quà Tặng',
        data: quaTang,
        backgroundColor: '#ff9500',
        stack: 'total',
        datalabels: {
          display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
          anchor: 'center', align: 'center',
          color: '#fff', font: { size: 9, weight: '600' },
          formatter: fmtShort,
        },
      },
      {
        label: 'Doanh thu sau quà tặng',
        data: dtSauQua,
        backgroundColor: '#0071e3',
        stack: 'total',
        datalabels: {
          display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
          anchor: 'center', align: 'center',
          color: '#fff', font: { size: 9, weight: '600' },
          formatter: fmtShort,
        },
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 8 } },
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73' } },
    y: { stacked: true, grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73', callback: fmtShort } },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      footerColor: '#1d1d1f', footerFont: { weight: '600', size: 12 }, footerMarginTop: 6,
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      itemSort: (a, b) => b.raw - a.raw,
      callbacks: {
        label: (c) => {
          const total = c.chart.data.datasets.reduce((s, ds) => s + (ds.data[c.dataIndex] || 0), 0)
          const pct = total > 0 ? ` (${((c.raw / total) * 100).toFixed(1)}%)` : ''
          return ` ${c.dataset.label}: ${fmtVND(c.raw)}${pct}`
        },
        footer: (items) => `Tổng: ${fmtVND(items.reduce((s, i) => s + i.raw, 0))}`,
      },
    },
    stackTotal: { display: true, formatter: fmtShort },
  },
}))
</script>

<style scoped>
.chart-legend { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.legend-item  { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--color-near-black); white-space: nowrap; }
.legend-item i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.legend-total { font-size: 11px; color: var(--color-secondary-gray); }
</style>
