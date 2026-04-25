<!-- Chart 2: Tỷ lệ doanh thu từng loại hình (donut) -->
<template>
  <ChartCard title="Tỷ lệ doanh thu từng loại hình" subtitle="Tỷ lệ doanh thu: DT sau quà tặng" :height="290">
    <div class="donut-layout">
      <div class="donut-wrap">
        <Doughnut :data="chartData" :options="chartOptions" :plugins="[centerPlugin]" />
      </div>
      <div class="legend">
        <div v-for="(item, i) in legendItems" :key="i" class="legend-row">
          <span class="dot" :style="{ background: item.color }"></span>
          <span class="lbl">{{ item.label }}</span>
          <span class="pct">{{ item.pct }}%</span>
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

const props = defineProps({ totalRevenue: Object })

const centerPlugin = {
  id: 'centerText2',
  afterDraw(chart) {
    const opt = chart.config.options?.plugins?.centerText
    if (!opt?.text) return
    const { ctx, chartArea } = chart
    const cx = (chartArea.left + chartArea.right) / 2
    const cy = (chartArea.top + chartArea.bottom) / 2
    ctx.save()
    ctx.font = '700 13px Inter, sans-serif'
    ctx.fillStyle = '#1d1d1f'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('100%', cx, cy)
    ctx.restore()
  },
}

const totalSum = computed(() =>
  LOAI_HINH.reduce((s, l) => s + (props.totalRevenue?.[l]?.dtSauQua || 0), 0)
)

const legendItems = computed(() =>
  LOAI_HINH.map((l) => {
    const val = props.totalRevenue?.[l]?.dtSauQua || 0
    const pct = totalSum.value > 0 ? ((val / totalSum.value) * 100).toFixed(1) : '0.0'
    return { label: LOAI_LABEL[l], color: LOAI_COLORS[l], pct }
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
    centerText: { text: '100%' },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: {
        label: (c) => {
          const pct = totalSum.value > 0 ? ((c.raw / totalSum.value) * 100).toFixed(1) : 0
          return ` ${pct}%`
        },
      },
    },
  },
}))
</script>

<style scoped>
.donut-layout { display: flex; align-items: center; gap: 16px; height: 100%; }
.donut-wrap { width: 160px; height: 160px; flex-shrink: 0; }
.legend { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.legend-row { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.lbl { flex: 1; color: var(--color-near-black); }
.pct { font-weight: 600; color: var(--color-near-black); min-width: 40px; text-align: right; }
</style>
