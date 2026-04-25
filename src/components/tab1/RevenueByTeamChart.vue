<!-- Chart 5: Tổng doanh thu từng team / chi nhánh (horizontal bar) -->
<template>
  <ChartCard title="Doanh thu theo Team / Chi nhánh" subtitle="Doanh thu: DT sau quà tặng" :height="chartHeight" :maxHeight="160">
    <template #control>
      <select class="ctrl-select" v-model="mode">
        <option value="team">Team</option>
        <option value="cn">Chi nhánh</option>
      </select>
    </template>

    <Bar :data="chartData" :options="chartOptions" :plugins="[axisPlugin]" />

    <template #footer>
      <div class="custom-xaxis">
        <div
          class="axis-inner"
          :style="{ marginLeft: axisLeft + 'px', marginRight: axisRightPad + 'px' }"
        >
          <span
            v-for="t in xTicks"
            :key="t.label"
            class="axis-tick"
            :style="{ left: t.pct + '%' }"
          >{{ t.label }}</span>
        </div>
      </div>
    </template>
  </ChartCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartCard from './ChartCard.vue'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({ revByTeam: Array, revByCN: Array })

const mode    = ref('team')
const items   = computed(() => mode.value === 'team' ? props.revByTeam : props.revByCN)
const chartHeight = computed(() => Math.max(100, (items.value?.length || 0) * 20))

/* Capture exact chart-area coords from Chart.js after each render */
const axisLeft    = ref(0)
const axisRightPad = ref(0)
const xTicks      = ref([])

const axisPlugin = {
  id: 'teamAxisCapture',
  afterRender(chart) {
    const x = chart.scales?.x
    if (!x) return
    axisLeft.value    = Math.round(x.left)
    axisRightPad.value = Math.round(chart.width - x.right)
    xTicks.value = x.ticks.map(tick => ({
      label: tick.value === 0 ? '0' : fmtShort(tick.value),
      pct: x.max > x.min
        ? ((tick.value - x.min) / (x.max - x.min)) * 100
        : 0,
    }))
  },
}

const chartData = computed(() => ({
  labels: (items.value || []).map(e => e[0]),
  datasets: [{
    label: 'Doanh thu sau quà tặng',
    data: (items.value || []).map(e => e[1]),
    backgroundColor: '#0071e3',
    hoverBackgroundColor: '#0066cc',
    borderRadius: 4,
    datalabels: {
      display: true,
      anchor: 'end', align: 'right', offset: 4,
      color: '#1d1d1f', font: { size: 10, weight: '600' },
      formatter: fmtShort,
    },
  }],
}))

const chartOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true, maintainAspectRatio: false,
  layout: { padding: { right: 60 } },
  scales: {
    x: {
      grid: { color: 'rgba(210,210,215,0.4)' },
      border: { display: false },
      ticks: { display: false },   /* hidden — replaced by HTML axis */
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11 }, color: '#1d1d1f' },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      callbacks: {
        label: c => {
          const total = c.dataset.data.reduce((s, v) => s + (v || 0), 0)
          const pct = total > 0 ? ` (${((c.raw / total) * 100).toFixed(1)}%)` : ''
          return ` ${fmtVND(c.raw)}${pct}`
        },
      },
    },
  },
}))
</script>

<style scoped>
/* Fixed x-axis rendered in ChartCard #footer slot */
.custom-xaxis {
  border-top: 1px solid rgba(210,210,215,0.4);
  padding-top: 4px;
  flex-shrink: 0;
}

.axis-inner {
  position: relative;
  height: 16px;
}

.axis-tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: 10px;
  color: var(--color-secondary-gray);
  white-space: nowrap;
}

.axis-tick:first-child {
  transform: translateX(0);
}

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
