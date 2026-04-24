<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <h3 class="chart-title">{{ title }}</h3>
      <p class="chart-subtitle">{{ subtitle }}</p>
    </div>
    <div class="chart-body">
      <!-- Donut -->
      <div class="donut-wrap">
        <Doughnut :data="chartData" :options="chartOptions" :plugins="[centerPlugin]" />
      </div>
      <!-- Legend -->
      <div class="legend">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="legend-item"
        >
          <span class="legend-dot" :style="{ background: item.color }"></span>
          <span class="legend-text">
            {{ item.label }}:
            <a class="legend-link">{{ formatNumber(item.value) }}</a>
            <span class="legend-pct">({{ item.pct }}%)</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'

const props = defineProps({
  title: String,
  subtitle: String,
  items: {
    type: Array,
    default: () => [],
    // Each: { label, value, color, pct }
  },
  total: { type: Number, default: 0 },
})

const formatNumber = (n) => new Intl.NumberFormat('vi-VN').format(n)

const centerPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const opt = chart.config.options?.plugins?.centerText
    if (!opt?.text) return
    const { ctx, chartArea } = chart
    const cx = (chartArea.left + chartArea.right) / 2
    const cy = (chartArea.top + chartArea.bottom) / 2
    ctx.save()
    ctx.font = `700 22px Inter, -apple-system, sans-serif`
    ctx.fillStyle = '#1d1d1f'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(opt.text, cx, cy)
    ctx.restore()
  },
}

const chartData = computed(() => ({
  datasets: [
    {
      data: props.items.map((i) => i.value),
      backgroundColor: props.items.map((i) => i.color),
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 4,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
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
        label: (ctx) => {
          const item = props.items[ctx.dataIndex]
          return ` ${item.label}: ${formatNumber(item.value)} (${item.pct}%)`
        },
      },
    },
    datalabels: { display: false },
    centerText: { text: formatNumber(props.total) },
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

.chart-body {
  display: flex;
  align-items: center;
  gap: 20px;
}

.donut-wrap {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

/* Legend */
.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  overflow-y: auto;
  max-height: 180px;
}

.legend-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  line-height: 1.4;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
}

.legend-text {
  color: var(--color-near-black);
  line-height: 1.45;
}

.legend-link {
  color: var(--color-link-blue);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}

.legend-pct {
  color: var(--color-secondary-gray);
  margin-left: 2px;
}
</style>
