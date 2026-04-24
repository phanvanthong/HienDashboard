<!-- Chart 5: Tổng doanh thu từng team / chi nhánh (horizontal bar) -->
<template>
  <ChartCard title="Doanh thu theo Team / Chi nhánh" :height="340">
    <template #control>
      <select class="ctrl-select" v-model="mode">
        <option value="team">Team</option>
        <option value="cn">Chi nhánh</option>
      </select>
    </template>
    <Bar :data="chartData" :options="chartOptions" />
  </ChartCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartCard from './ChartCard.vue'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({
  revByTeam: Array,
  revByCN: Array,
})

const mode = ref('team')

const items = computed(() => mode.value === 'team' ? props.revByTeam : props.revByCN)

const chartData = computed(() => ({
  labels: (items.value || []).map((e) => e[0]),
  datasets: [{
    label: 'Doanh thu sau quà tặng',
    data: (items.value || []).map((e) => e[1]),
    backgroundColor: '#0071e3',
    hoverBackgroundColor: '#0066cc',
    borderRadius: 4,
    datalabels: {
      display: true,
      anchor: 'end',
      align: 'right',
      offset: 4,
      color: '#1d1d1f',
      font: { size: 10, weight: '600' },
      formatter: fmtShort,
    },
  }],
}))

const chartOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true, maintainAspectRatio: false,
  layout: { padding: { right: 60 } },
  scales: {
    x: { grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false }, ticks: { font: { size: 10 }, color: '#6e6e73', callback: fmtShort } },
    y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#1d1d1f' } },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: { label: (c) => ` ${fmtVND(c.raw)}` },
    },
  },
}))
</script>

<style scoped>
.ctrl-select {
  font-size: 12px;
  color: var(--color-near-black);
  background: var(--color-pale-gray);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  padding: 4px 24px 4px 8px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236e6e73' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
  flex-shrink: 0;
}
</style>
