<!-- Số lượng đơn hàng SAT, IELTS: stacked bar (Hoàn thiện + Đăng ký mới) + DT thực tế (line, trục phải) -->
<template>
  <ChartCard title="Số lượng đơn hàng SAT, IELTS" :total="`${grandTotal} đơn`" :headerColumn="true">
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
        <span class="legend-item">
          <i class="line-dash" style="background:#ff9500"></i>DT thực tế
          <span class="legend-total">{{ fmtShort(totalDtThucTe) }}</span>
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
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({ satIeltsOrders: Object })

const stackPlugin = stackTotalPlugin

const totalHt       = computed(() => (props.satIeltsOrders?.SAT?.ht    || 0) + (props.satIeltsOrders?.IELTS?.ht    || 0))
const totalDkm      = computed(() => (props.satIeltsOrders?.SAT?.dkm   || 0) + (props.satIeltsOrders?.IELTS?.dkm   || 0))
const grandTotal    = computed(() => totalHt.value + totalDkm.value)
const totalDtThucTe = computed(() => (props.satIeltsOrders?.SAT?.dtThucTe || 0) + (props.satIeltsOrders?.IELTS?.dtThucTe || 0))

const chartData = computed(() => ({
  labels: ['SAT', 'IELTS'],
  datasets: [
    {
      label: 'Đăng ký mới',
      data: [props.satIeltsOrders?.SAT?.dkm || 0, props.satIeltsOrders?.IELTS?.dkm || 0],
      backgroundColor: '#5b8def',
      stack: 's',
      yAxisID: 'y',
      order: 2,
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
      yAxisID: 'y',
      order: 2,
      datalabels: {
        display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
        anchor: 'center', align: 'center', color: '#fff', font: { size: 11, weight: '600' },
        formatter: (v) => v || '',
      },
    },
    {
      type: 'line',
      label: 'DT thực tế',
      data: [props.satIeltsOrders?.SAT?.dtThucTe || 0, props.satIeltsOrders?.IELTS?.dtThucTe || 0],
      yAxisID: 'y1',
      order: 1,
      borderColor: '#ff9500',
      backgroundColor: '#ff9500',
      pointBackgroundColor: '#ff9500',
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 2,
      datalabels: { display: false },
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
    y1: {
      type: 'linear',
      position: 'right',
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11 }, color: '#ff9500', callback: fmtShort },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      footerColor: '#1d1d1f', footerFont: { weight: '600', size: 12 }, footerMarginTop: 6,
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: {
        label: (c) => {
          if (c.dataset.type === 'line') {
            return ` ${c.dataset.label}: ${fmtVND(c.raw)}`
          }
          const barTotal = c.chart.data.datasets
            .filter((_, di) => c.chart.getDatasetMeta(di).type !== 'line')
            .reduce((s, ds) => s + (ds.data[c.dataIndex] || 0), 0)
          const pct = barTotal > 0 ? ` (${((c.raw / barTotal) * 100).toFixed(1)}%)` : ''
          return ` ${c.dataset.label}: ${c.raw} đơn${pct}`
        },
        footer: (items) => {
          const total = items
            .filter((i) => i.dataset.type !== 'line')
            .reduce((s, i) => s + i.raw, 0)
          return `Tổng: ${total} đơn`
        },
      },
    },
    stackTotal: { display: true, formatter: (v) => v.toString() },
  },
}))
</script>

<style scoped>
.chart-legend { display: flex; align-items: center; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }
.legend-item  { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--color-near-black); white-space: nowrap; }
.legend-item i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.legend-item i.line-dash { height: 2px; border-radius: 1px; width: 14px; }
.legend-total { font-size: 11px; color: var(--color-secondary-gray); }
</style>
