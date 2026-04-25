<!-- Doanh thu theo chi nhánh: donut, dùng cột Doanh thu thực tế theo CN -->
<template>
  <ChartCard title="Doanh thu theo chi nhánh" subtitle="Doanh thu: DT thực tế, CN" :height="230">
    <div class="donut-layout">
      <div class="donut-wrap">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
      <div class="legend">
        <div v-for="(item, i) in legendItems" :key="i" class="legend-row">
          <span class="dot" :style="{ background: item.color }"></span>
          <span class="lbl">{{ item.label }}</span>
          <span class="val-pct">{{ fmtShort(item.val) }} — {{ item.pct }}%</span>
        </div>
      </div>
    </div>
  </ChartCard>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import ChartCard from './ChartCard.vue'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({ revByCNDtThucTe: Array })

const COLORS = ['#0071e3', '#34c759', '#ff9500', '#af52de', '#ff6b6b', '#5ac8fa', '#ffcc02', '#8e8e93']

const totalSum = computed(() => (props.revByCNDtThucTe || []).reduce((s, e) => s + e[1], 0))

const legendItems = computed(() =>
  (props.revByCNDtThucTe || []).map((e, i) => ({
    label: e[0],
    val: e[1],
    color: COLORS[i % COLORS.length],
    pct: totalSum.value > 0 ? ((e[1] / totalSum.value) * 100).toFixed(1) : '0.0',
  }))
)

const chartData = computed(() => ({
  labels: (props.revByCNDtThucTe || []).map(e => e[0]),
  datasets: [{
    data: (props.revByCNDtThucTe || []).map(e => e[1]),
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
        label: c => {
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
.donut-wrap   { width: 130px; height: 130px; flex-shrink: 0; }
.legend       { flex: 1; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; }
.legend-row   { display: flex; align-items: center; gap: 6px; font-size: 11.5px; }
.dot          { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lbl          { flex: 1; color: var(--color-near-black); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.val-pct      { font-weight: 600; color: var(--color-near-black); white-space: nowrap; flex-shrink: 0; }
</style>
