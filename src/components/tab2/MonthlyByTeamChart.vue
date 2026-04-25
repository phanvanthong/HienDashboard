<!-- Tab2: Biến động doanh thu theo Team — line chart per nhân viên trong team được chọn -->
<template>
  <ChartCard title="Biến động doanh thu theo Team" subtitle="Doanh thu: DT sau quà tặng, Team, Sale">
    <template #control>
      <div class="control-group">
        <div class="legend-wrap">
          <div class="chart-legend" ref="legendEl">
            <span v-for="(s, idx) in visibleSales" :key="s" class="legend-item">
              <i :style="{ background: PALETTE[idx % PALETTE.length] }"></i>{{ s }}
            </span>
            <span
              v-if="hiddenCount > 0"
              class="legend-more"
              ref="moreEl"
              @mouseenter="showMore = true"
              @mouseleave="showMore = false"
            >+{{ hiddenCount }}</span>
          </div>
        </div>

        <!-- Popup danh sách nhân viên bị ẩn -->
        <Teleport to="body">
          <div
            v-if="showMore && hiddenCount > 0"
            class="more-popup"
            :style="morePopupStyle"
            @mouseenter="showMore = true"
            @mouseleave="showMore = false"
          >
            <div v-for="(s, i) in hiddenSales" :key="s" class="more-popup-item">
              <span class="more-dot" :style="{ background: PALETTE[(visibleCount + i) % PALETTE.length] }"></span>
              {{ s }}
            </div>
          </div>
        </Teleport>
        <select class="ctrl-select" v-model="selectedTeam">
          <option v-for="t in teams" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </template>
    <Line :data="chartData" :options="chartOptions" />
  </ChartCard>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useExternalTooltip } from '../../composables/useExternalTooltip.js'
import { Line } from 'vue-chartjs'
import ChartCard from '../tab1/ChartCard.vue'
import { fmtVND, fmtShort } from '../../utils/formatters.js'

const props = defineProps({
  byMonth:  { type: Array, default: () => [] },
  filtered: { type: Array, default: () => [] },
})

const PALETTE = ['#0071e3', '#34c759', '#ff9500', '#af52de', '#ff6b6b', '#5ac8fa', '#ffcc02', '#8e8e93', '#ff3b30', '#30d158']
const TWO_ROW_H = 42

const teams = computed(() => {
  const set = new Set(props.filtered.map(r => r.team).filter(Boolean))
  return [...set].sort()
})

const selectedTeam = ref('')

watch(teams, (val) => {
  if (val.length && !val.includes(selectedTeam.value)) {
    selectedTeam.value = val[0]
  }
}, { immediate: true })

const months = computed(() => props.byMonth.map(m => m.month))

const sales = computed(() => {
  const team = selectedTeam.value
  const set = new Set(
    props.filtered
      .filter(r => r.team === team && r.sale)
      .map(r => r.sale)
  )
  return [...set].sort()
})

// Legend overflow trimming
const legendEl  = ref(null)
const visibleCount = ref(0)

const visibleSales = computed(() => sales.value.slice(0, visibleCount.value))
const hiddenSales  = computed(() => sales.value.slice(visibleCount.value))
const hiddenCount  = computed(() => hiddenSales.value.length)

// Hover popup for +N badge
const moreEl       = ref(null)
const showMore     = ref(false)

const morePopupStyle = computed(() => {
  if (!moreEl.value) return {}
  const r = moreEl.value.getBoundingClientRect()
  return {
    position: 'fixed',
    top:  (r.bottom + 6) + 'px',
    left: r.left + 'px',
    zIndex: 10000,
  }
})

watch(sales, (s) => {
  visibleCount.value = s.length
  nextTick(trimLegend)
}, { immediate: true })

function trimLegend() {
  const el = legendEl.value
  if (!el) return
  if (el.scrollHeight > TWO_ROW_H + 2 && visibleCount.value > 1) {
    visibleCount.value--
    nextTick(trimLegend)
  }
}

const { externalTooltip } = useExternalTooltip({ colorKey: 'border' })

onUnmounted(() => {
})

// Chart data
const saleMonthMap = computed(() => {
  const team = selectedTeam.value
  const ms = months.value
  const map = {}
  sales.value.forEach(s => { map[s] = Object.fromEntries(ms.map(m => [m, 0])) })
  props.filtered.forEach(r => {
    if (r.team !== team || !r.sale || !r.thang) return
    const key = `${r.nam || 2024}-${String(r.thang).padStart(2, '0')}`
    if (map[r.sale] && Object.prototype.hasOwnProperty.call(map[r.sale], key)) {
      map[r.sale][key] += r.dtSauQua || 0
    }
  })
  return map
})

const chartData = computed(() => ({
  labels: props.byMonth.map(d => d.label),
  datasets: sales.value.map((s, idx) => ({
    label: s,
    data: months.value.map(m => saleMonthMap.value[s]?.[m] || 0),
    borderColor: PALETTE[idx % PALETTE.length],
    backgroundColor: PALETTE[idx % PALETTE.length],
    pointBackgroundColor: PALETTE[idx % PALETTE.length],
    tension: 0.3,
    pointRadius: 3,
    pointHoverRadius: 5,
    fill: false,
    datalabels: { display: false },
  })),
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 8 } },
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11 }, color: '#6e6e73' },
    },
    y: {
      grid: { color: 'rgba(210,210,215,0.4)' },
      border: { display: false },
      ticks: { font: { size: 11 }, color: '#6e6e73', callback: fmtShort },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: false,
      external: externalTooltip,
    },
  },
}))
</script>

<style scoped>
/* Keep title from wrapping when control is multi-row */
:deep(.chart-card-header) { align-items: flex-start; }
:deep(.chart-card-header > div:first-child) { flex-shrink: 0; padding-top: 2px; }

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-shrink: 1;
  max-width: 72%;
}

.legend-wrap {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.chart-legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  max-height: 42px;
  overflow: hidden;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-near-black);
  white-space: nowrap;
}

.legend-item i {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-more {
  font-size: 11px;
  color: var(--color-secondary-gray);
  white-space: nowrap;
  font-weight: 500;
  cursor: pointer;
}
.legend-more:hover { color: var(--color-near-black); }

/* popup is teleported to body — needs non-scoped styles below */

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
  margin-top: 1px;
}
</style>

<style>
.more-popup {
  background: rgba(255,255,255,0.97);
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  min-width: 160px;
}
.more-popup-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #1d1d1f;
  padding: 3px 0;
  white-space: nowrap;
}
.more-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
