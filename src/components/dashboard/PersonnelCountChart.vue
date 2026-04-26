<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <h3 class="chart-title">Số lượng nhân sự</h3>
      <p class="chart-subtitle">Tất cả đơn vị - Theo tháng - Năm 2024</p>
    </div>
    <div class="chart-wrap">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

const months = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
]

const counts = [2215, 2241, 2260, 2294, 2304, 2313, 2324, 2330, 2336, 2336, 2337, 2341]

const formatVi = (n) => new Intl.NumberFormat('vi-VN').format(n)

const chartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: 'Số lượng nhân sự',
      data: counts,
      backgroundColor: '#5b8def',
      hoverBackgroundColor: '#4070d8',
      borderRadius: 3,
      borderSkipped: false,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 22 } },
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
        label: (ctx) => ` ${formatVi(ctx.parsed.y)} nhân viên`,
      },
    },
    datalabels: {
      display: true,
      anchor: 'end',
      align: 'top',
      offset: -2,
      color: '#1d1d1f',
      font: { size: 9.5, weight: '500', family: 'Inter, sans-serif' },
      formatter: formatVi,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { family: 'Inter, -apple-system, sans-serif', size: 10.5 },
        color: '#6e6e73',
        maxRotation: 45,
      },
    },
    y: {
      grid: { color: 'rgba(210,210,215,0.4)' },
      border: { display: false },
      min: 0,
      max: 4000,
      ticks: {
        font: { family: 'Inter, -apple-system, sans-serif', size: 11 },
        color: '#6e6e73',
        stepSize: 1000,
      },
      title: {
        display: true,
        text: 'Số lượng nhân sự',
        font: { size: 10, family: 'Inter, sans-serif' },
        color: '#6e6e73',
      },
    },
  },
}))
</script>

<style scoped>
.chart-card {
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-card-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-near-black);
  letter-spacing: -0.15px;
}

.chart-subtitle {
  font-size: 12px;
  color: var(--color-secondary-gray);
}

.chart-wrap {
  height: 220px;
  position: relative;
}
</style>
