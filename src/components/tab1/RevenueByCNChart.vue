<!-- Doanh thu theo chi nhánh: donut, dùng cột Doanh thu thực tế theo CN -->
<template>
  <ChartCard title="Doanh thu theo chi nhánh" subtitle="Doanh thu: DT thực tế, CN" :height="230">
    <div class="donut-layout">
      <div class="donut-wrap">
        <Doughnut :data="chartData" :options="chartOptions" :plugins="[centerTextPlugin]" />
      </div>
      <div class="legend">
        <div v-for="(item, i) in legendItems" :key="i" class="legend-row">
          <span class="dot" :style="{ background: item.color }"></span>
          <div class="legend-info">
            <span class="lbl">{{ item.label }}</span>
            <span class="stats">
              {{ fmtShort(item.val) }} · {{ item.pct }}%
              &nbsp;~&nbsp;{{ item.saleCount }} sale
              &nbsp;~&nbsp;{{ fmtShort(item.avg) }}/sale
            </span>
          </div>
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

const props = defineProps({ revByCNDtThucTe: { type: Array, default: () => [] } })

const COLORS = ['#0071e3', '#34c759', '#ff9500', '#af52de', '#ff6b6b', '#5ac8fa', '#ffcc02', '#8e8e93']

const totalSum = computed(() => (props.revByCNDtThucTe).reduce((s, e) => s + e.dtThucTe, 0))

const legendItems = computed(() =>
  props.revByCNDtThucTe.map((e, i) => {
    const pct = totalSum.value > 0 ? ((e.dtThucTe / totalSum.value) * 100).toFixed(1) : '0.0'
    const avg = e.saleCount > 0 ? Math.round(e.dtThucTe / e.saleCount) : 0
    return { label: e.cn, val: e.dtThucTe, color: COLORS[i % COLORS.length], pct, saleCount: e.saleCount, avg }
  })
)

const chartData = computed(() => ({
  labels: props.revByCNDtThucTe.map(e => e.cn),
  datasets: [{
    data: props.revByCNDtThucTe.map(e => e.dtThucTe),
    backgroundColor: COLORS,
    borderWidth: 2, borderColor: '#fff', hoverOffset: 4,
  }],
}))

const centerTextPlugin = {
  id: 'centerText',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart
    if (!chartArea) return
    const cx = (chartArea.left + chartArea.right) / 2
    const cy = (chartArea.top + chartArea.bottom) / 2
    ctx.save()
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = '#1d1d1f'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(fmtShort(totalSum.value), cx, cy)
    ctx.restore()
  }
}

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
          const item = legendItems.value[c.dataIndex]
          if (!item) return ''
          return ` ${fmtVND(item.val)} (${item.pct}%) · ${item.saleCount} sale · ${fmtShort(item.avg)}/sale`
        },
      },
    },
  },
}))
</script>

<style scoped>
.donut-layout { display: flex; align-items: center; gap: 16px; height: 100%; }
.donut-wrap   { position: relative; width: 130px; height: 130px; flex-shrink: 0; }
.legend       { flex: 1; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }
.legend-row   { display: flex; align-items: flex-start; gap: 6px; }
.dot          { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
.legend-info  { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.lbl          { font-size: 11.5px; font-weight: 600; color: var(--color-near-black); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stats        { font-size: 10.5px; color: var(--color-secondary-gray); white-space: nowrap; }
</style>
