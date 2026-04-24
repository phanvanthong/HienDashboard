<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <h3 class="chart-title">Biến động nhân sự</h3>
      <p class="chart-subtitle">Tất cả đơn vị - Theo tháng - Năm 2024</p>
    </div>
    <div class="chart-wrap">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

const months = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
]

const chartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: 'Tiếp nhận (88)',
      data: [12, 15, 12, 9, 5, 5, 7, 3, 2, 6, 7, 5],
      borderColor: '#34c759',
      backgroundColor: 'rgba(52,199,89,0.08)',
      pointBackgroundColor: '#34c759',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Nghỉ việc (27)',
      data: [3, 1, 2, 1, 3, 2, 1, 2, 1, 4, 4, 3],
      borderColor: '#ff6b8a',
      backgroundColor: 'rgba(255,107,138,0.08)',
      pointBackgroundColor: '#ff6b8a',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: false,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        font: { family: 'Inter, -apple-system, sans-serif', size: 12 },
        color: '#1d1d1f',
        padding: 16,
        boxWidth: 8,
        boxHeight: 8,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)',
      titleColor: '#1d1d1f',
      bodyColor: '#6e6e73',
      borderColor: '#d2d2d7',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      boxPadding: 4,
    },
    datalabels: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { family: 'Inter, -apple-system, sans-serif', size: 11 },
        color: '#6e6e73',
        maxRotation: 45,
      },
    },
    y: {
      grid: { color: 'rgba(210,210,215,0.4)' },
      border: { display: false, dash: [3, 3] },
      min: 0,
      max: 30,
      ticks: {
        font: { family: 'Inter, -apple-system, sans-serif', size: 11 },
        color: '#6e6e73',
        stepSize: 10,
      },
      title: {
        display: true,
        text: 'Số lượng nhân...',
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
  gap: 12px;
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
