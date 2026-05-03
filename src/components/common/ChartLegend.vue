<!-- Shared overflow-aware chart legend. Items overflow 2 rows → +N badge with hover popup -->
<template>
  <div class="chart-legend" ref="legendEl" :style="{ maxHeight: maxH + 'px' }">
    <span v-for="(item, idx) in visibleItems" :key="idx" class="legend-item">
      <i
        :class="['legend-icon',
          item.shape === 'square' ? 'legend-icon--sq' :
          item.shape === 'line'   ? 'legend-icon--ln' : '']"
        :style="{ background: item.color }"
      ></i>{{ item.label }}<span v-if="item.value != null" class="legend-val">{{ item.value }}</span>
    </span>
    <span
      v-if="hiddenCount > 0"
      class="legend-more"
      ref="moreEl"
      @mouseenter="showMore = true"
      @mouseleave="showMore = false"
    >+{{ hiddenCount }}</span>
  </div>
  <Teleport to="body">
    <div
      v-if="showMore && hiddenCount > 0"
      class="clgnd-popup"
      :style="popupStyle"
      @mouseenter="showMore = true"
      @mouseleave="showMore = false"
    >
      <div v-for="(item, i) in hiddenItems" :key="i" class="clgnd-popup-row">
        <span
          class="clgnd-dot"
          :class="item.shape === 'line' ? 'clgnd-dot--ln' : ''"
          :style="{ background: item.color }"
        ></span>{{ item.label }}<span v-if="item.value != null" class="clgnd-popup-val">{{ item.value }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] }, // [{ label, color, value?, shape?: 'circle'|'square'|'line' }]
  maxH:  { type: Number, default: 42 },      // max height before +N kicks in (px); 42 ≈ 2 rows
})

const legendEl     = ref(null)
const moreEl       = ref(null)
const showMore     = ref(false)
const visibleCount = ref(0)

const visibleItems = computed(() => props.items.slice(0, visibleCount.value))
const hiddenItems  = computed(() => props.items.slice(visibleCount.value))
const hiddenCount  = computed(() => hiddenItems.value.length)

const popupStyle = computed(() => {
  if (!moreEl.value) return {}
  const r = moreEl.value.getBoundingClientRect()
  return { position: 'fixed', top: (r.bottom + 6) + 'px', left: r.left + 'px', zIndex: 10000 }
})

watch(() => props.items, (items) => {
  visibleCount.value = items.length
  nextTick(trimLegend)
}, { immediate: true })

function trimLegend() {
  const el = legendEl.value
  if (!el) return
  if (el.scrollHeight > props.maxH + 2 && visibleCount.value > 1) {
    visibleCount.value--
    nextTick(trimLegend)
  }
}
</script>

<style scoped>
.chart-legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px 12px;
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

.legend-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-icon--sq { border-radius: 2px; width: 10px; height: 10px; }
.legend-icon--ln { border-radius: 1px; width: 14px; height: 2px; }

.legend-val {
  font-size: 10px;
  color: var(--color-secondary-gray);
}

.legend-more {
  font-size: 11px;
  color: var(--color-secondary-gray);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}
.legend-more:hover { color: var(--color-near-black); }
</style>

<style>
.clgnd-popup {
  background: rgba(255,255,255,0.97);
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  min-width: 140px;
}
.clgnd-popup-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #1d1d1f;
  padding: 3px 0;
  white-space: nowrap;
}
.clgnd-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.clgnd-dot--ln {
  border-radius: 1px;
  width: 14px;
  height: 2px;
}
.clgnd-popup-val {
  font-size: 10px;
  color: #6e6e73;
  margin-left: 2px;
}
</style>
