<!-- Row-1 left: 5 KPI metrics card -->
<template>
  <div class="kpi-card">
    <div class="kpi-row-top">
      <!-- Big: Tổng doanh thu -->
      <div class="kpi-cell kpi-big">
        <div class="icon-circle blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="14"/>
          </svg>
        </div>
        <div class="kpi-text">
          <div class="kpi-label">Tổng doanh thu</div>
          <div class="kpi-big-value">{{ fmtShort(totalDtThucTe) }}</div>
        </div>
        <div class="ring-wrap">
          <svg viewBox="0 0 44 44" class="ring-svg">
            <circle cx="22" cy="22" r="17" fill="none" stroke="#e5e5ea" stroke-width="4.5"/>
            <circle cx="22" cy="22" r="17" fill="none" stroke="#0071e3" stroke-width="4.5"
              stroke-linecap="round" :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference * (1 - dtSauQuaRatio)"
              transform="rotate(-90 22 22)"/>
          </svg>
          <span class="ring-pct">{{ Math.round(dtSauQuaRatio * 100) }}%</span>
        </div>
      </div>
      <!-- Số đơn mới -->
      <div class="kpi-cell kpi-plain">
        <div class="kpi-label">Số lượng đơn hàng mới:</div>
        <div class="kpi-count">{{ totalDkm.toLocaleString('vi-VN') }}</div>
      </div>
    </div>

    <div class="kpi-row-bot">
      <!-- Tổng quà tặng -->
      <div class="kpi-cell kpi-icon-row">
        <div class="icon-circle pink">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
        </div>
        <div>
          <div class="kpi-label">Tổng quà tặng:</div>
          <div class="kpi-value">{{ fmtShort(totalQuaTang) }}</div>
        </div>
      </div>
      <!-- DT sau quà tặng -->
      <div class="kpi-cell kpi-icon-row">
        <div class="icon-circle teal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <div>
          <div class="kpi-label">DT sau quà tặng:</div>
          <div class="kpi-value">{{ fmtShort(totalDtSauQua) }}</div>
        </div>
      </div>
      <!-- Số đơn hoàn thiện -->
      <div class="kpi-cell kpi-plain">
        <div class="kpi-label">Số lượng đơn hàng hoàn thiện:</div>
        <div class="kpi-count">{{ totalHt.toLocaleString('vi-VN') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LOAI_HINH } from '../../composables/useRevenueData.js'
import { fmtShort } from '../../utils/formatters.js'

const props = defineProps({
  totalDtThucTe:  { type: Number, default: 0 },
  totalRevenue:   { type: Object, default: () => ({}) },
  revByCategory:  { type: Object, default: () => ({}) },
})

const totalQuaTang  = computed(() => LOAI_HINH.reduce((s, l) => s + (props.totalRevenue?.[l]?.quaTang  || 0), 0))
const totalDtSauQua = computed(() => LOAI_HINH.reduce((s, l) => s + (props.totalRevenue?.[l]?.dtSauQua || 0), 0))
const totalDkm      = computed(() => LOAI_HINH.reduce((s, l) => s + (props.revByCategory?.[l]?.count_dkm || 0), 0))
const totalHt       = computed(() => LOAI_HINH.reduce((s, l) => s + (props.revByCategory?.[l]?.count_ht  || 0), 0))

const circumference  = 2 * Math.PI * 17  // r=17
const dtSauQuaRatio  = computed(() =>
  props.totalDtThucTe > 0 ? Math.min(totalDtSauQua.value / props.totalDtThucTe, 1) : 0
)
</script>

<style scoped>
.kpi-card {
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  box-sizing: border-box;
}

.kpi-row-top {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
  flex: 1;
}
.kpi-row-bot {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  flex: 1;
}

.kpi-cell {
  background: var(--color-pale-gray);
  border-radius: 10px;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.kpi-big   { gap: 12px; }
.kpi-plain { flex-direction: column; align-items: flex-start; gap: 6px; }
.kpi-icon-row { gap: 10px; }

.kpi-text { flex: 1; min-width: 0; }

.kpi-label {
  font-size: 11px;
  color: var(--color-secondary-gray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-big-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-near-black);
  letter-spacing: -0.5px;
  margin-top: 2px;
}
.kpi-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-near-black);
  margin-top: 2px;
}
.kpi-count {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-near-black);
  letter-spacing: -0.3px;
}

/* Icon circles */
.icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-circle.blue { background: #0071e3; }
.icon-circle.pink { background: #ff6b6b; }
.icon-circle.teal { background: #34c759; }

/* Progress ring */
.ring-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}
.ring-svg {
  width: 44px;
  height: 44px;
  display: block;
}
.ring-pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #0071e3;
}
</style>
