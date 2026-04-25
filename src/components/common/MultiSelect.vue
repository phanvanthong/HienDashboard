<template>
  <div class="ms-wrap" ref="wrapEl">
    <button class="ms-trigger" @click="toggleOpen" ref="triggerEl">
      <span class="ms-label">{{ triggerLabel }}</span>
      <svg class="ms-chevron" :class="{ rotated: open }" viewBox="0 0 10 6" fill="none"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M1 1l4 4 4-4"/>
      </svg>
    </button>

    <Teleport to="body">
      <div v-if="open" class="ms-dropdown" :style="dropdownStyle" ref="dropEl">
        <label class="ms-item ms-all">
          <input
            type="checkbox"
            :checked="isAllSelected"
            :indeterminate="isIndeterminate"
            @change="toggleAll"
          />
          <span class="ms-text">Tất cả</span>
        </label>
        <div class="ms-divider"></div>
        <label v-for="opt in options" :key="opt.value" class="ms-item">
          <input
            type="checkbox"
            :checked="modelValue.includes(opt.value)"
            @change="toggle(opt.value)"
          />
          <span v-if="opt.color" class="ms-dot" :style="{ background: opt.color }"></span>
          <span class="ms-text">{{ opt.label }}</span>
        </label>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  options:    { type: Array, required: true },
  modelValue: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue'])

const open      = ref(false)
const wrapEl    = ref(null)
const triggerEl = ref(null)
const dropEl    = ref(null)

const dropdownStyle = ref({})

function updatePosition() {
  if (!triggerEl.value) return
  const r = triggerEl.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - r.bottom
  const spaceAbove = r.top

  // Default: open below; flip above if not enough space
  if (spaceBelow < 200 && spaceAbove > spaceBelow) {
    dropdownStyle.value = {
      position: 'fixed',
      bottom: (window.innerHeight - r.top + 4) + 'px',
      right:  (window.innerWidth  - r.right)   + 'px',
      zIndex: 9999,
    }
  } else {
    dropdownStyle.value = {
      position: 'fixed',
      top:   (r.bottom + 4) + 'px',
      right: (window.innerWidth - r.right) + 'px',
      zIndex: 9999,
    }
  }
}

function toggleOpen() {
  open.value = !open.value
  if (open.value) nextTick(updatePosition)
}

const isAllSelected   = computed(() => props.modelValue.length === props.options.length)
const isIndeterminate = computed(() => props.modelValue.length > 0 && props.modelValue.length < props.options.length)

function toggleAll() {
  if (isAllSelected.value) {
    emit('update:modelValue', [props.options[0].value])
  } else {
    emit('update:modelValue', props.options.map(o => o.value))
  }
}

const triggerLabel = computed(() => {
  const n = props.modelValue.length
  if (n === 0)                    return 'Không có'
  if (n === props.options.length) return 'Tất cả'
  if (n === 1) return props.options.find(o => o.value === props.modelValue[0])?.label ?? ''
  return `${n} loại`
})

function toggle(val) {
  const next = props.modelValue.includes(val)
    ? props.modelValue.filter(v => v !== val)
    : [...props.modelValue, val]
  if (next.length === 0) return
  emit('update:modelValue', next)
}

function onOutside(e) {
  if (
    wrapEl.value && !wrapEl.value.contains(e.target) &&
    dropEl.value  && !dropEl.value.contains(e.target)
  ) {
    open.value = false
  }
}

onMounted(()  => document.addEventListener('mousedown', onOutside))
onUnmounted(() => document.removeEventListener('mousedown', onOutside))
</script>

<style scoped>
.ms-wrap {
  position: relative;
  flex-shrink: 0;
}

.ms-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-near-black);
  background: var(--color-pale-gray);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s;
}
.ms-trigger:hover { border-color: var(--color-mid-border); }

.ms-chevron {
  width: 10px;
  height: 6px;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.ms-chevron.rotated { transform: rotate(180deg); }
</style>

<style>
.ms-dropdown {
  min-width: 160px;
  max-height: 320px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d2d2d7;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  padding: 6px 0;
}

.ms-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 12.5px;
  color: #1d1d1f;
  transition: background 0.1s;
  user-select: none;
  white-space: nowrap;
}
.ms-item:hover { background: #f5f5f7; }

.ms-item input[type="checkbox"] {
  width: 13px;
  height: 13px;
  accent-color: #0071e3;
  flex-shrink: 0;
  cursor: pointer;
}

.ms-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ms-text { flex: 1; }

.ms-all { font-weight: 500; }

.ms-divider { height: 1px; background: #d2d2d7; margin: 4px 0; }
</style>
