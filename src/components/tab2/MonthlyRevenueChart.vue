<!-- Tab2: Tổng doanh thu theo tháng (stacked bar: Quà Tặng + DT sau quà tặng) -->
<template>
  <ChartCard title="Tổng doanh thu" subtitle="Tổng doanh thu: Quà tặng, DT sau quà tặng" :total="fmtShort(grandTotal)">
    <template #control>
      <div class="control-group">
        <div class="chart-legend">
          <span v-for="ds in ALL_DS" :key="ds.key" class="legend-item">
            <i :style="{ background: ds.color }"></i>{{ ds.label }}
            <span class="legend-total">{{ fmtShort(dsTotals[ds.key]) }}</span>
          </span>
        </div>
        <MultiSelect :options="options" v-model="selected" />
      </div>
    </template>
    <Bar :data="chartData" :options="chartOptions" :plugins="[stackPlugin]" />
  </ChartCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartCard from '../tab1/ChartCard.vue'
import MultiSelect from '../common/MultiSelect.vue'
import { stackTotalPlugin } from '../../plugins/stackTotalPlugin.js'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({ byMonth: Array })
const stackPlugin = stackTotalPlugin

const ALL_DS = [
  { key: 'quaTang',  label: 'Quà Tặng',       color: '#ff9500', data: d => d.quaTang  },
  { key: 'dtSauQua', label: 'DT sau quà tặng', color: '#0071e3', data: d => d.dtSauQua },
]
const options  = ALL_DS.map(ds => ({ value: ds.key, label: ds.label }))
const selected = ref(ALL_DS.map(ds => ds.key))

const dsTotals = computed(() => {
  const m = props.byMonth || []
  return {
    quaTang:  m.reduce((s, d) => s + (d.quaTang  || 0), 0),
    dtSauQua: m.reduce((s, d) => s + (d.dtSauQua || 0), 0),
  }
})
const grandTotal = computed(() => dsTotals.value.quaTang + dsTotals.value.dtSauQua)

const chartData = computed(() => ({
  labels: (props.byMonth || []).map(d => d.label),
  datasets: ALL_DS
    .filter(ds => selected.value.includes(ds.key))
    .map(ds => ({
      label: ds.label,
      data: (props.byMonth || []).map(ds.data),
      backgroundColor: ds.color,
      stack: 'total',
      datalabels: {
        display: ctx => ctx.dataset.data[ctx.dataIndex] > 0,
        anchor: 'center', align: 'center',
        color: '#fff', font: { size: 9, weight: '600' },
        formatter: fmtShort,
      },
    })),
}))

const chartOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false,
  layout: { padding: { top: 18 } },
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73' } },
    y: { stacked: true, grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false }, ticks: { font: { size: 11 }, color: '#6e6e73', callback: fmtShort } },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.96)', titleColor: '#1d1d1f', bodyColor: '#6e6e73',
      footerColor: '#1d1d1f', footerFont: { weight: '600', size: 12 }, footerMarginTop: 6,
      borderColor: '#d2d2d7', borderWidth: 1, padding: 10, cornerRadius: 8,
      itemSort: (a, b) => b.raw - a.raw,
      callbacks: {
        label: c => {
          const total = c.chart.data.datasets.reduce((s, ds) => s + (ds.data[c.dataIndex] || 0), 0)
          const pct = total > 0 ? ` (${((c.raw / total) * 100).toFixed(1)}%)` : ''
          return ` ${c.dataset.label}: ${fmtVND(c.raw)}${pct}`
        },
        footer: items => `Tổng: ${fmtVND(items.reduce((s, i) => s + i.raw, 0))}`,
      },
    },
    stackTotal: { display: true, formatter: fmtShort },
  },
}))
</script>

<style scoped>
.control-group { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.chart-legend  { display: flex; align-items: center; gap: 12px; }
.legend-item   { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--color-near-black); white-space: nowrap; }
.legend-item i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.legend-total  { font-size: 11px; color: var(--color-secondary-gray); }
</style>
