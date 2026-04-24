<!-- Chart 1: Tổng doanh thu (stacked bar: Quà Tặng + Doanh thu sau quà tặng) by Loại hình -->
<template>
  <ChartCard title="Tổng doanh thu" subtitle="Phân theo loại hình dịch vụ">
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
  layout: { padding: { top: 24 } },
  scales: {
    x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73' } },
    y: { stacked: true, grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73', callback: fmtShort } },
  },
  plugins: {
    legend: { position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'rect', font: { size: 12 }, padding: 12 } },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: { label: (c) => ` ${c.dataset.label}: ${fmtVND(c.raw)}` },
    },
    stackTotal: { display: true, formatter: fmtShort },
  },
}))
</script>
