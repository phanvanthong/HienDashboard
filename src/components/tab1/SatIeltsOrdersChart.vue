<!-- Số lượng đơn hàng SAT, IELTS: stacked bar, Hoàn thiện (bottom) + Đăng ký mới (top) -->
<template>
  <ChartCard title="Số lượng đơn hàng SAT, IELTS" subtitle="Số đơn hàng: Loại hình KH, Chi tiết môn học" :total="`${grandTotal} đơn`">
    <template #control>
      <div class="chart-legend">
        <span class="legend-item">
          <i style="background:#34c759"></i>Hoàn thiện
          <span class="legend-total">{{ totalHt }} đơn</span>
        </span>
        <span class="legend-item">
          <i style="background:#5b8def"></i>Đăng ký mới
          <span class="legend-total">{{ totalDkm }} đơn</span>
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

const props = defineProps({ satIeltsOrders: Object })

const stackPlugin = stackTotalPlugin

const totalHt  = computed(() => (props.satIeltsOrders?.SAT?.ht   || 0) + (props.satIeltsOrders?.IELTS?.ht  || 0))
const totalDkm = computed(() => (props.satIeltsOrders?.SAT?.dkm  || 0) + (props.satIeltsOrders?.IELTS?.dkm || 0))
const grandTotal = computed(() => totalHt.value + totalDkm.value)

const chartData = computed(() => ({
  labels: ['SAT', 'IELTS'],
  datasets: [
    {
      label: 'Đăng ký mới',
      data: [props.satIeltsOrders?.SAT?.dkm || 0, props.satIeltsOrders?.IELTS?.dkm || 0],
      backgroundColor: '#5b8def',
      stack: 's',
      datalabels: {
        display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
        anchor: 'center', align: 'center', color: '#fff', font: { size: 11, weight: '600' },
        formatter: (v) => v || '',
      },
    },
    {
      label: 'Hoàn thiện',
      data: [props.satIeltsOrders?.SAT?.ht || 0, props.satIeltsOrders?.IELTS?.ht || 0],
      backgroundColor: '#34c759',
      stack: 's',
      datalabels: {
        display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
        anchor: 'center', align: 'center', color: '#fff', font: { size: 11, weight: '600' },
        formatter: (v) => v || '',
      },
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false,
  layout: { padding: { top: 22 } },
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 12 }, color: '#6e6e73' } },
    y: { stacked: true, grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73', precision: 0 } },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      footerColor: '#1d1d1f', footerFont: { weight: '600', size: 12 }, footerMarginTop: 6,
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: {
        label: (c) => {
          const total = c.chart.data.datasets.reduce((s, ds) => s + (ds.data[c.dataIndex] || 0), 0)
          const pct = total > 0 ? ` (${((c.raw / total) * 100).toFixed(1)}%)` : ''
          return ` ${c.dataset.label}: ${c.raw} đơn${pct}`
        },
        footer: (items) => `Tổng: ${items.reduce((s, i) => s + i.raw, 0)} đơn`,
      },
    },
    stackTotal: { display: true, formatter: (v) => v.toString() },
  },
}))
</script>

<style scoped>
.chart-legend { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.legend-item  { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--color-near-black); white-space: nowrap; }
.legend-item i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.legend-total { font-size: 11px; color: var(--color-secondary-gray); }
</style>
