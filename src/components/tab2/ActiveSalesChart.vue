<!-- Tab2 Chart 8: Biến động số lượng sale hoạt động theo tháng -->
<template>
  <ChartCard title="Biến động số lượng Sale hoạt động" subtitle="Số sale có giao dịch theo từng tháng" :height="280">
    <Line :data="chartData" :options="chartOptions" />
  </ChartCard>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import ChartCard from '../tab1/ChartCard.vue'

const props = defineProps({ activeSalesByMonth: Array })

const fmtLabel = (m) => {
  const [y, mo] = m.split('-')
  return `T${parseInt(mo)}/${y}`
}

const chartData = computed(() => ({
  labels: (props.activeSalesByMonth || []).map((d) => fmtLabel(d.month)),
  datasets: [
    {
      label: 'Sale hoạt động',
      data: (props.activeSalesByMonth || []).map((d) => d.count),
      borderColor: '#0071e3',
      backgroundColor: 'rgba(0,113,227,0.08)',
      pointBackgroundColor: '#0071e3',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.35,
      fill: true,
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        offset: 2,
        color: '#0071e3',
        font: { size: 10, weight: '600' },
        formatter: (v) => v,
      },
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 20 } },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11 }, color: '#6e6e73' },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(210,210,215,0.4)' },
      border: { display: false },
      ticks: { font: { size: 11 }, color: '#6e6e73', precision: 0 },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)',
      titleColor: '#1d1d1f',
      bodyColor: '#6e6e73',
      borderColor: '#d2d2d7',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (c) => ` ${c.raw} sale hoạt động`,
      },
    },
  },
}))
</script>
