<!-- Tab2: Doanh thu theo loại hình từng tháng (stacked bar) -->
<template>
  <ChartCard title="Doanh thu theo loại hình" subtitle="Doanh thu: DT sau quà tặng, Loại hình" :total="fmtShort(grandTotal)">
    <template #control>
      <div class="control-group">
        <div class="chart-legend">
          <span v-for="l in activeLoai" :key="l" class="legend-item">
            <i :style="{ background: LOAI_COLORS[l] }"></i>{{ LOAI_LABEL[l] }}
            <span class="legend-total">{{ fmtShort(loaiTotals[l]) }}</span>
          </span>
        </div>
        <MultiSelect :options="options" v-model="selected" />
      </div>
    </template>
    <Bar :data="chartData" :options="chartOptions" :plugins="[stackPlugin]" />
  </ChartCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartCard from '../tab1/ChartCard.vue'
import MultiSelect from '../common/MultiSelect.vue'
import { stackTotalPlugin } from '../../plugins/stackTotalPlugin.js'
import { LOAI_HINH, LOAI_LABEL, LOAI_COLORS } from '../../composables/useRevenueData.js'
import { fmtVND, fmtShort } from '../../utils/formatters.js'
import { useExternalTooltip } from '../../composables/useExternalTooltip.js'

const { externalTooltip } = useExternalTooltip({ colorKey: 'background', showPercent: true })

const props = defineProps({ byMonth: Array })
const stackPlugin = stackTotalPlugin

const options = LOAI_HINH.map(l => ({ value: l, label: LOAI_LABEL[l] }))

const loaiTotals = computed(() => {
  const totals = {}
  LOAI_HINH.forEach(l => {
    totals[l] = (props.byMonth || []).reduce((s, d) => s + (d.byLoai?.[l] || 0), 0)
  })
  return totals
})

const loaiCountTotals = computed(() => {
  const totals = {}
  LOAI_HINH.forEach(l => {
    totals[l] = (props.byMonth || []).reduce((s, d) => s + (d.byLoaiCount?.[l] || 0), 0)
  })
  return totals
})

const activeLoai = computed(() =>
  LOAI_HINH
    .filter(l => (props.byMonth || []).some(d => (d.byLoai?.[l] || 0) > 0))
    .sort((a, b) => loaiCountTotals.value[b] - loaiCountTotals.value[a])
)
const selected = ref([...LOAI_HINH])
watch(activeLoai, val => { selected.value = [...val] }, { immediate: true })
const grandTotal = computed(() => Object.values(loaiTotals.value).reduce((s, v) => s + v, 0))

const chartData = computed(() => ({
  labels: (props.byMonth || []).map(d => d.label),
  datasets: LOAI_HINH
    .filter(l => selected.value.includes(l))
    .map(l => ({
      label: LOAI_LABEL[l],
      data: (props.byMonth || []).map(d => d.byLoai?.[l] || 0),
      backgroundColor: LOAI_COLORS[l],
      stack: 'total',
      datalabels: {
        display: ctx => ctx.dataset.data[ctx.dataIndex] > 0,
        anchor: 'center', align: 'center',
        color: '#fff', font: { size: 8, weight: '600' },
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
    tooltip: { enabled: false, external: externalTooltip },
    stackTotal: { display: true, formatter: fmtShort },
  },
}))
</script>

<style scoped>
.control-group { display: flex; align-items: flex-start; gap: 10px; }
.chart-legend  { display: grid; grid-template-columns: repeat(4, max-content); align-items: center; gap: 6px 16px; flex: 1; }
.legend-item   { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--color-near-black); white-space: nowrap; }
.legend-item i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-total  { font-size: 10px; color: var(--color-secondary-gray); }
</style>
