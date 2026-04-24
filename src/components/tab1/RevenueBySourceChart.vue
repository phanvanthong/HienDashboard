<!-- Chart 7: Doanh thu theo nguồn data (donut) -->
<template>
  <ChartCard title="Doanh thu theo nguồn data" subtitle="Tổng doanh thu thực tế · Phân loại nguồn" :height="290">
    <div class="donut-layout">
      <div class="donut-wrap">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
      <div class="legend">
        <div v-for="(item, i) in legendItems" :key="i" class="legend-row">
          <span class="dot" :style="{ background: item.color }"></span>
          <div class="lbl-wrap">
            <span class="lbl">{{ item.label }}</span>
            <span class="val">{{ fmtVND(item.val) }}</span>
          </div>
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
import { fmtVND } from '../../utils/formatters.js'

const props = defineProps({ revBySource: Array })

const COLORS = ['#0071e3', '#34c759', '#ff9500', '#af52de', '#ff6b6b', '#5ac8fa', '#ffcc02', '#8e8e93']

const totalSum = computed(() => (props.revBySource || []).reduce((s, e) => s + e[1], 0))

const legendItems = computed(() =>
  (props.revBySource || []).map((e, i) => ({
    label: e[0],
    val: e[1],
    color: COLORS[i % COLORS.length],
    pct: totalSum.value > 0 ? ((e[1] / totalSum.value) * 100).toFixed(1) : '0.0',
  }))
)

const chartData = computed(() => ({
  labels: (props.revBySource || []).map((e) => e[0]),
  datasets: [{
    data: (props.revBySource || []).map((e) => e[1]),
    backgroundColor: COLORS,
    borderWidth: 2, borderColor: '#fff', hoverOffset: 4,
  }],
}))

const chartOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: { display: false },
    datalabels: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: {
        label: (c) => {
          const pct = totalSum.value > 0 ? ((c.raw / totalSum.value) * 100).toFixed(1) : 0
          return ` ${fmtVND(c.raw)} (${pct}%)`
        },
      },
    },
  },
}))
</script>

<style scoped>
.donut-layout { display: flex; align-items: center; gap: 16px; height: 100%; }
.donut-wrap { width: 150px; height: 150px; flex-shrink: 0; }
.legend { flex: 1; display: flex; flex-direction: column; gap: 7px; overflow-y: auto; }
.legend-row { display: flex; align-items: center; gap: 7px; font-size: 12px; }
.dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.lbl-wrap { flex: 1; min-width: 0; }
.lbl { display: block; color: var(--color-near-black); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.val { display: block; font-size: 11px; color: var(--color-secondary-gray); }
.pct { font-weight: 600; color: var(--color-near-black); min-width: 38px; text-align: right; flex-shrink: 0; }
</style>
