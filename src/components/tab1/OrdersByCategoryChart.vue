<!-- Chart 4: Số lượng đơn hàng từng loại hình (stacked bar) + DT thực tế (line, trục phải) -->
<template>
  <ChartCard :title="title" :subtitle="subtitle" :total="`${grandTotal} đơn`">
    <template #control>
      <ChartLegend :items="legendItems" />
    </template>
    <Bar :data="chartData" :options="chartOptions" :plugins="[stackPlugin]" />
  </ChartCard>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartCard from './ChartCard.vue'
import ChartLegend from '../common/ChartLegend.vue'
import { stackTotalPlugin } from '../../plugins/stackTotalPlugin.js'
import { LOAI_HINH, LOAI_LABEL } from '../../composables/useRevenueData.js'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({
  revByCategory: Object,
  title: { type: String, default: 'Số lượng đơn hàng theo phân loại học sinh' },
  subtitle: { type: String, default: 'Số đơn hàng: Loại hình, Phân loại học sinh — DT thực tế' },
})
const stackPlugin = stackTotalPlugin
const labels = LOAI_HINH.map((l) => LOAI_LABEL[l])

const totalDkm     = computed(() => LOAI_HINH.reduce((s, l) => s + (props.revByCategory?.[l]?.count_dkm || 0), 0))
const totalHt      = computed(() => LOAI_HINH.reduce((s, l) => s + (props.revByCategory?.[l]?.count_ht  || 0), 0))
const grandTotal   = computed(() => totalDkm.value + totalHt.value)
const totalDtThucTe = computed(() => LOAI_HINH.reduce((s, l) => s + (props.revByCategory?.[l]?.dtThucTe || 0), 0))

const legendItems = computed(() => [
  { label: 'Đăng ký mới', color: '#5b8def', value: `${totalDkm.value} đơn`,        shape: 'square' },
  { label: 'Hoàn thiện',  color: '#34c759', value: `${totalHt.value} đơn`,          shape: 'square' },
  { label: 'DT thực tế',  color: '#ff9500', value: fmtShort(totalDtThucTe.value),   shape: 'line'   },
])

const chartData = computed(() => {
  const dkm = LOAI_HINH.map((l) => props.revByCategory?.[l]?.count_dkm || 0)
  const ht  = LOAI_HINH.map((l) => props.revByCategory?.[l]?.count_ht  || 0)
  const dt  = LOAI_HINH.map((l) => props.revByCategory?.[l]?.dtThucTe  || 0)
  return {
    labels,
    datasets: [
      {
        label: 'Đăng ký mới',
        data: dkm,
        backgroundColor: '#5b8def',
        stack: 's',
        yAxisID: 'y',
        order: 2,
        datalabels: {
          display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
          anchor: 'center', align: 'center', color: '#fff', font: { size: 10, weight: '600' },
          formatter: (v) => v || '',
        },
      },
      {
        label: 'Hoàn thiện',
        data: ht,
        backgroundColor: '#34c759',
        stack: 's',
        yAxisID: 'y',
        order: 2,
        datalabels: {
          display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
          anchor: 'center', align: 'center', color: '#fff', font: { size: 10, weight: '600' },
          formatter: (v) => v || '',
        },
      },
      {
        type: 'line',
        label: 'DT thực tế',
        data: dt,
        yAxisID: 'y1',
        order: 1,
        borderColor: '#ff9500',
        backgroundColor: '#ff9500',
        pointBackgroundColor: '#ff9500',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        datalabels: { display: false },
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false,
  layout: { padding: { top: 22 } },
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73' } },
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
    stackTotal: {
      display: true,
      formatter: (v) => v.toString(),
    },
  },
}))
</script>

