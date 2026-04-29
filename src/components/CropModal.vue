<template>
  <div class="crop-overlay" @mousedown.self="$emit('cancel')">
    <div class="crop-card">
      <div class="crop-header">
        <h3 class="crop-title">Căn chỉnh ảnh đại diện</h3>
        <p class="crop-sub">Kéo để di chuyển · cuộn để phóng to/thu nhỏ</p>
      </div>

      <div class="crop-canvas-wrap">
        <canvas
          ref="canvasEl"
          :width="CS"
          :height="CS"
          class="crop-canvas"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @wheel.prevent="onWheel"
          @touchstart.prevent="startTouch"
          @touchmove.prevent="onTouch"
          @touchend="stopDrag"
        />
      </div>

      <div class="crop-zoom-row">
        <button class="zoom-btn" @click="zoom(-0.1)">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
        </button>
        <input type="range" class="zoom-slider" :min="minScale" :max="3" step="0.01"
          :value="scale" @input="setScale(+$event.target.value)" />
        <button class="zoom-btn" @click="zoom(0.1)">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
        </button>
      </div>

      <div class="crop-footer">
        <button class="btn-cancel" @click="$emit('cancel')">Hủy</button>
        <button class="btn-confirm" @click="confirm">Xác nhận</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ imageSrc: String })
const emit = defineEmits(['confirm', 'cancel'])

const CS = 300          // canvas display size
const CR = 118          // crop circle radius
const CX = CS / 2       // crop center x
const CY = CS / 2       // crop center y
const OUTPUT = 128      // output size px

const canvasEl = ref(null)
let ctx = null
let img = null

const scale = ref(1)
const minScale = ref(1)
let offsetX = 0
let offsetY = 0

let dragging = false
let lastX = 0, lastY = 0
let lastTouchDist = 0

// ── init ──────────────────────────────────────────
onMounted(() => {
  ctx = canvasEl.value.getContext('2d')
  img = new Image()
  img.onload = () => {
    // Fit image to cover crop circle initially
    const ratio = Math.max((CR * 2) / img.width, (CR * 2) / img.height)
    minScale.value = ratio
    scale.value = ratio
    // Center image on canvas
    offsetX = CX - (img.width * ratio) / 2
    offsetY = CY - (img.height * ratio) / 2
    draw()
  }
  img.src = props.imageSrc
})

// ── draw ──────────────────────────────────────────
function draw() {
  if (!ctx || !img) return
  ctx.clearRect(0, 0, CS, CS)

  // Image
  ctx.drawImage(img, offsetX, offsetY, img.width * scale.value, img.height * scale.value)

  // Dark overlay with rounded-square cutout
  const r = CR * 0.18  // corner radius tỉ lệ với kích thước
  const x0 = CX - CR, y0 = CY - CR, side = CR * 2
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.52)'
  ctx.beginPath()
  ctx.rect(0, 0, CS, CS)
  // Rounded rect path (ngược chiều để tạo cutout)
  ctx.moveTo(x0 + r, y0)
  ctx.lineTo(x0 + side - r, y0)
  ctx.arcTo(x0 + side, y0, x0 + side, y0 + r, r)
  ctx.lineTo(x0 + side, y0 + side - r)
  ctx.arcTo(x0 + side, y0 + side, x0 + side - r, y0 + side, r)
  ctx.lineTo(x0 + r, y0 + side)
  ctx.arcTo(x0, y0 + side, x0, y0 + side - r, r)
  ctx.lineTo(x0, y0 + r)
  ctx.arcTo(x0, y0, x0 + r, y0, r)
  ctx.closePath()
  ctx.fill('evenodd')
  ctx.restore()

  // Rounded-square border
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x0 + r, y0)
  ctx.lineTo(x0 + side - r, y0)
  ctx.arcTo(x0 + side, y0, x0 + side, y0 + r, r)
  ctx.lineTo(x0 + side, y0 + side - r)
  ctx.arcTo(x0 + side, y0 + side, x0 + side - r, y0 + side, r)
  ctx.lineTo(x0 + r, y0 + side)
  ctx.arcTo(x0, y0 + side, x0, y0 + side - r, r)
  ctx.lineTo(x0, y0 + r)
  ctx.arcTo(x0, y0, x0 + r, y0, r)
  ctx.closePath()
  ctx.stroke()

  // Grid lines (thirds)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + r, y0); ctx.lineTo(x0 + side - r, y0)
  ctx.arcTo(x0 + side, y0, x0 + side, y0 + r, r)
  ctx.lineTo(x0 + side, y0 + side - r)
  ctx.arcTo(x0 + side, y0 + side, x0 + side - r, y0 + side, r)
  ctx.lineTo(x0 + r, y0 + side)
  ctx.arcTo(x0, y0 + side, x0, y0 + side - r, r)
  ctx.lineTo(x0, y0 + r)
  ctx.arcTo(x0, y0, x0 + r, y0, r)
  ctx.closePath()
  ctx.clip()
  for (let i = 1; i < 3; i++) {
    const gx = x0 + side / 3 * i
    const gy = y0 + side / 3 * i
    ctx.moveTo(gx, y0); ctx.lineTo(gx, y0 + side)
    ctx.moveTo(x0, gy); ctx.lineTo(x0 + side, gy)
  }
  ctx.stroke()
  ctx.restore()
}

// ── zoom ──────────────────────────────────────────
function setScale(v) {
  const s = Math.max(minScale.value, Math.min(3, v))
  // Scale around crop center
  const dx = (CX - offsetX)
  const dy = (CY - offsetY)
  offsetX = CX - dx * (s / scale.value)
  offsetY = CY - dy * (s / scale.value)
  scale.value = s
  draw()
}

function zoom(delta) { setScale(scale.value + delta) }

function onWheel(e) { zoom(e.deltaY < 0 ? 0.08 : -0.08) }

// ── drag ──────────────────────────────────────────
function startDrag(e) {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
}

function onDrag(e) {
  if (!dragging) return
  offsetX += e.clientX - lastX
  offsetY += e.clientY - lastY
  lastX = e.clientX
  lastY = e.clientY
  draw()
}

function stopDrag() { dragging = false }

// ── touch ─────────────────────────────────────────
function startTouch(e) {
  if (e.touches.length === 1) {
    dragging = true
    lastX = e.touches[0].clientX
    lastY = e.touches[0].clientY
  } else if (e.touches.length === 2) {
    lastTouchDist = touchDist(e)
  }
}

function onTouch(e) {
  if (e.touches.length === 1 && dragging) {
    offsetX += e.touches[0].clientX - lastX
    offsetY += e.touches[0].clientY - lastY
    lastX = e.touches[0].clientX
    lastY = e.touches[0].clientY
    draw()
  } else if (e.touches.length === 2) {
    const d = touchDist(e)
    zoom((d - lastTouchDist) * 0.005)
    lastTouchDist = d
  }
}

function touchDist(e) {
  const dx = e.touches[0].clientX - e.touches[1].clientX
  const dy = e.touches[0].clientY - e.touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

// ── confirm ───────────────────────────────────────
function confirm() {
  const out = document.createElement('canvas')
  out.width = OUTPUT
  out.height = OUTPUT
  const oc = out.getContext('2d')

  // Source region = crop square area in display canvas, mapped back to image coords
  const srcX = (CX - CR - offsetX) / scale.value
  const srcY = (CY - CR - offsetY) / scale.value
  const srcW = (CR * 2) / scale.value
  oc.drawImage(img, srcX, srcY, srcW, srcW, 0, 0, OUTPUT, OUTPUT)

  emit('confirm', out.toDataURL('image/jpeg', 0.88))
}

onBeforeUnmount(() => { img = null })
</script>

<style scoped>
.crop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 700;
}

.crop-card {
  background: #1a2332;
  border-radius: 16px;
  width: 340px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.crop-header {
  padding: 18px 20px 12px;
  text-align: center;
}

.crop-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 3px;
}

.crop-sub {
  font-size: 11.5px;
  color: #8a9bbc;
}

.crop-canvas-wrap {
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.crop-canvas {
  border-radius: 8px;
  cursor: grab;
  display: block;
  width: 300px;
  height: 300px;
  touch-action: none;
}

.crop-canvas:active { cursor: grabbing; }

.crop-zoom-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px 6px;
}

.zoom-btn {
  background: rgba(255,255,255,0.08);
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #c0cfeb;
  flex-shrink: 0;
  transition: background 0.15s;
}
.zoom-btn:hover { background: rgba(255,255,255,0.15); }
.zoom-btn svg { width: 16px; height: 16px; }

.zoom-slider {
  flex: 1;
  accent-color: var(--color-action-blue);
  cursor: pointer;
  height: 4px;
}

.crop-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px 18px;
}

.btn-cancel {
  height: 34px;
  padding: 0 16px;
  background: rgba(255,255,255,0.08);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #c0cfeb;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.15); }

.btn-confirm {
  height: 34px;
  padding: 0 18px;
  background: var(--color-action-blue);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-confirm:hover { background: #0062c4; }
</style>
