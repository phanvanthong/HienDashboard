import { onUnmounted } from 'vue'
import { fmtVND } from '../utils/formatters.js'

export function useExternalTooltip({ formatValue = fmtVND, colorKey = 'auto', showPercent = false } = {}) {
  const id = `ext-tt-${Math.random().toString(36).slice(2, 7)}`

  function getOrCreate() {
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('div')
      el.id = id
      el.setAttribute('style', [
        'position:fixed',
        'background:rgba(255,255,255,0.97)',
        'border:1px solid #d2d2d7',
        'border-radius:8px',
        'padding:10px 12px',
        'font-size:12px',
        'font-family:Inter,sans-serif',
        'pointer-events:none',
        'z-index:9999',
        'box-shadow:0 4px 16px rgba(0,0,0,0.10)',
        'max-height:80vh',
        'overflow-y:auto',
        'opacity:0',
        'transition:opacity 0.1s',
      ].join(';'))
      document.body.appendChild(el)
    }
    return el
  }

  function getColor(p) {
    if (colorKey === 'border') return p.dataset.borderColor
    if (colorKey === 'background') return p.dataset.backgroundColor
    // auto: prefer borderColor for lines, backgroundColor for bars
    return p.dataset.borderColor || p.dataset.backgroundColor
  }

  function externalTooltip(context) {
    const { chart, tooltip } = context
    const el = getOrCreate()

    if (tooltip.opacity === 0) { el.style.opacity = '0'; return }

    const title  = tooltip.title?.[0] ?? ''
    const points = [...(tooltip.dataPoints ?? [])].sort((a, b) => b.raw - a.raw)
    const total  = points.reduce((s, i) => s + (i.raw || 0), 0)

    el.innerHTML = `
      <div style="font-weight:600;color:#1d1d1f;margin-bottom:6px;font-size:12.5px">${title}</div>
      ${points.filter(p => p.raw > 0).map(p => `
        <div style="display:flex;align-items:center;gap:6px;color:#6e6e73;margin:3px 0">
          <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${getColor(p)};flex-shrink:0"></span>
          <span style="white-space:nowrap">${p.dataset.label}: ${formatValue(p.raw)}${showPercent && total > 0 ? ` (${((p.raw / total) * 100).toFixed(1)}%)` : ''}</span>
        </div>
      `).join('')}
      <div style="font-weight:600;color:#1d1d1f;margin-top:7px;padding-top:7px;border-top:1px solid #e5e5e7;font-size:12.5px">
        Tổng: ${formatValue(total)}
      </div>
    `

    const rect   = chart.canvas.getBoundingClientRect()
    const caretX = rect.left + tooltip.caretX
    const caretY = rect.top  + tooltip.caretY

    el.style.opacity = '1'
    const elW = el.offsetWidth || 220
    const elH = el.offsetHeight || 160
    // Vertical: center on caret, clamp within viewport
    let top = caretY - elH / 2
    if (top + elH > window.innerHeight - 8) top = window.innerHeight - elH - 8
    if (top < 8) top = 8
    el.style.top = top + 'px'
    // Horizontal: prefer right of caret, flip left if no room
    el.style.left = caretX + elW + 16 > window.innerWidth
      ? (caretX - elW - 12) + 'px'
      : (caretX + 12) + 'px'
  }

  onUnmounted(() => document.getElementById(id)?.remove())

  return { externalTooltip }
}
