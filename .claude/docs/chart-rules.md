# Chart Rules — HienDashboard

Rules kỹ thuật chi tiết cho tất cả loại biểu đồ. Đọc file này khi cần tra cứu config cụ thể.

---

## Imports chuẩn

```js
import { fmtVND, fmtShort } from '../../utils/formatters.js'
import { LOAI_HINH, LOAI_LABEL, LOAI_COLORS } from '../../composables/useRevenueData.js'
import { stackTotalPlugin } from '../../plugins/stackTotalPlugin.js'
import { useExternalTooltip } from '../../composables/useExternalTooltip.js'
import ChartCard from '../tab1/ChartCard.vue'   // Tab2 cũng import từ tab1/
import MultiSelect from '../common/MultiSelect.vue'
```

`fmtShort` → trục Y, data labels, legend totals, stackTotal
`fmtVND` → tooltip callbacks, bảng

---

## ChartCard props

```html
<ChartCard
  title="..."
  subtitle="Doanh thu: DT sau quà tặng, Loại hình"
  :total="fmtShort(grandTotal)"
  :height="280"
  :maxHeight="0"
  :headerColumn="false"
>
  <template #control> ... </template>
  <!-- default slot: chart -->
  <template #footer> ... </template>
</ChartCard>
```

- `height` default 280; donut dùng 230; horizontal bar dùng dynamic `:height="chartHeight"`
- `maxHeight` chỉ set khi cần scroll (bảng)
- `headerColumn="true"` khi control quá rộng cần stack dọc
- `total` luôn là string: `fmtShort(n)` hoặc `` `${n} đơn` ``

---

## Tooltip canvas chuẩn (Tab1)

```js
tooltip: {
  backgroundColor: 'rgba(255,255,255,0.96)',
  titleColor: '#1d1d1f', bodyColor: '#6e6e73',
  borderColor: '#d2d2d7', borderWidth: 1,
  padding: 10, cornerRadius: 8,
}
```

Thêm footer cho stacked bar:
```js
footerColor: '#1d1d1f',
footerFont: { weight: '600', size: 12 },
footerMarginTop: 6,
itemSort: (a, b) => b.raw - a.raw,
callbacks: {
  label: c => {
    const total = c.chart.data.datasets.reduce((s, ds) => s + (ds.data[c.dataIndex] || 0), 0)
    const pct = total > 0 ? ` (${((c.raw / total) * 100).toFixed(1)}%)` : ''
    return ` ${c.dataset.label}: ${fmtVND(c.raw)}${pct}`
    // đếm: return ` ${c.dataset.label}: ${c.raw} đơn${pct}`
  },
  footer: items => `Tổng: ${fmtVND(items.reduce((s, i) => s + i.raw, 0))}`,
},
```

---

## External Tooltip (Tab2 — bắt buộc)

```js
const { externalTooltip } = useExternalTooltip({
  colorKey: 'background',  // bar
  // colorKey: 'border',   // line
  showPercent: true,       // stacked bar; false cho line
})
// trong chartOptions:
plugins: { tooltip: { enabled: false, external: externalTooltip } }
```

---

## Scale configs

**Stacked bar (tiền):**
```js
x: { stacked: true, grid: { display: false }, border: { display: false },
     ticks: { font: { size: 11 }, color: '#6e6e73' } },
y: { stacked: true, grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false },
     ticks: { font: { size: 11 }, color: '#6e6e73', callback: fmtShort } },
```

**Stacked bar (đếm):** thay `callback: fmtShort` bằng `precision: 0`

**Line:**
```js
x: { grid: { display: false }, border: { display: false },
     ticks: { font: { size: 11 }, color: '#6e6e73' } },
y: { beginAtZero: true, grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false },
     ticks: { font: { size: 11 }, color: '#6e6e73', callback: fmtShort } },
```

**Horizontal bar:**
```js
indexAxis: 'y',
layout: { padding: { right: 60 } },
x: { grid: { color: 'rgba(210,210,215,0.4)' }, border: { display: false }, ticks: { display: false } },
y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#1d1d1f' } },
```

---

## Stacked Bar dataset

```js
{
  stack: 'total',
  backgroundColor: COLOR,
  datalabels: {
    display: ctx => ctx.dataset.data[ctx.dataIndex] > 0,
    anchor: 'center', align: 'center',
    color: '#fff', font: { size: 9, weight: '600' },
    formatter: fmtShort,   // hoặc v => v cho đếm
  },
}
```

`stackTotalPlugin` config:
```js
plugins: { stackTotal: { display: true, formatter: fmtShort } }
layout: { padding: { top: 18 } }   // 22 nếu font lớn hơn
```

---

## Donut dataset & options

```js
datasets: [{ data, backgroundColor, borderWidth: 2, borderColor: '#fff', hoverOffset: 4 }]

options: {
  cutout: '65%',   // hoặc '62%'
  plugins: {
    legend: { display: false },
    datalabels: { display: false },   // luôn tắt
    tooltip: { /* canvas chuẩn */ callbacks: { label: c => ` ${fmtVND(c.raw)} (${pct}%)` } },
  },
}
```

Legend donut (template + CSS):
```html
<div class="donut-layout">
  <div class="donut-wrap"><Doughnut ... /></div>
  <div class="legend">
    <div v-for="item in legendItems" class="legend-row">
      <span class="dot" :style="{ background: item.color }"></span>
      <span class="lbl">{{ item.label }}</span>
      <span class="val-pct">{{ fmtShort(item.val) }} — {{ item.pct }}%</span>
    </div>
  </div>
</div>
```
```css
.donut-layout { display: flex; align-items: center; gap: 16px; height: 100%; }
.donut-wrap   { width: 130px; height: 130px; flex-shrink: 0; }
.legend       { flex: 1; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }
.legend-row   { display: flex; align-items: center; gap: 6px; font-size: 11.5px; }
.dot          { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lbl          { flex: 1; color: var(--color-near-black); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.val-pct      { font-weight: 600; color: var(--color-near-black); white-space: nowrap; flex-shrink: 0; }
```

Filter bỏ item 0%: `.filter(i => parseFloat(i.pct) > 0)`

---

## Line chart dataset

```js
{
  borderColor: PALETTE[idx % PALETTE.length],
  backgroundColor: PALETTE[idx % PALETTE.length],  // hoặc 'rgba(0,113,227,0.08)' khi fill
  pointBackgroundColor: PALETTE[idx % PALETTE.length],
  tension: 0.3, pointRadius: 3, pointHoverRadius: 5,
  fill: false,
  datalabels: { display: false },   // multi-line
}
```

Datalabels trên điểm (single line):
```js
datalabels: { display: true, anchor: 'end', align: 'top', offset: 2,
              color: '#0071e3', font: { size: 10, weight: '600' }, formatter: v => v }
layout: { padding: { top: 20 } }
```

Multi-line không datalabels: `layout: { padding: { top: 8 } }`

PALETTE: `['#0071e3','#34c759','#ff9500','#af52de','#ff6b6b','#5ac8fa','#ffcc02','#8e8e93','#ff3b30','#30d158']`

---

## MultiSelect pattern

```js
const options = items.map(i => ({ value: i.key, label: i.label }))
const selected = ref([...allKeys])
watch(activeItems, val => { selected.value = [...val] }, { immediate: true })
```

Legend 2 items (flex):
```css
.control-group { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.chart-legend  { display: flex; align-items: center; gap: 12px; }
.legend-item   { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--color-near-black); white-space: nowrap; }
.legend-item i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.legend-total  { font-size: 11px; color: var(--color-secondary-gray); }
```

Legend 8 loại hình (grid):
```css
.control-group { display: flex; align-items: flex-start; gap: 10px; }
.chart-legend  { display: grid; grid-template-columns: repeat(4, max-content); gap: 6px 16px; flex: 1; }
.legend-item   { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--color-near-black); white-space: nowrap; }
.legend-item i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-total  { font-size: 10px; color: var(--color-secondary-gray); }
```

---

## Select dropdown (ctrl-select)

```css
.ctrl-select {
  font-size: 12px; color: var(--color-near-black);
  background: var(--color-pale-gray);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  padding: 4px 24px 4px 8px;
  cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236e6e73' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 7px center; flex-shrink: 0;
}
```

---

## Teleport popup

```html
<Teleport to="body">
  <div v-if="show" class="popup" :style="style" @mouseenter="show=true" @mouseleave="show=false">
    ...
  </div>
</Teleport>
```

```js
const style = computed(() => {
  if (!triggerEl.value) return {}
  const r = triggerEl.value.getBoundingClientRect()
  return { position: 'fixed', top: (r.bottom + 6) + 'px', left: r.left + 'px', zIndex: 10000 }
})
```

CSS popup dùng `<style>` **không scoped**:
```css
.popup {
  background: rgba(255,255,255,0.97); border: 1px solid #d2d2d7;
  border-radius: 8px; padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12); min-width: 160px;
}
```

---

## Màu cố định

| Dùng cho | Giá trị |
|---|---|
| Đăng ký mới (bar) | `#5b8def` |
| Hoàn thiện (bar) | `#34c759` |
| Quà Tặng | `#ff9500` |
| DT sau quà tặng | `#0071e3` |
| Fill area line | `rgba(0,113,227,0.08)` |
| 8 loại hình | `LOAI_COLORS[key]` |

---

## Bảng (Table)

```css
.table-card {
  background: var(--color-white); border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-lg); padding: 18px 20px;
  display: flex; flex-direction: column; gap: 14px;
}
thead th {
  position: sticky; top: 0; background: var(--color-pale-gray);
  padding: 9px 12px; font-size: 11.5px; font-weight: 600;
  color: var(--color-secondary-gray); text-transform: uppercase;
  letter-spacing: 0.3px; border-bottom: 1px solid var(--color-soft-border); white-space: nowrap;
}
td { padding: 9px 12px; color: var(--color-near-black); white-space: nowrap; }
```

Giá trị 0 hiển thị `'—'`: `row.val > 0 ? fmtVND(row.val) : '—'`
