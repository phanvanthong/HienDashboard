<!-- Chart 6: Xếp hạng doanh số từng sale (table) -->
<template>
  <div class="table-card">
    <div class="table-card-header">
      <h3 class="chart-title">Xếp hạng doanh số theo Sale</h3>
      <p class="chart-subtitle">Doanh thu sau quà tặng · Sắp xếp từ cao xuống thấp</p>
    </div>
    <div class="table-wrap">
      <table class="rank-table">
        <thead>
          <tr>
            <th class="th-center">STT</th>
            <th class="th-code">Mã NV</th>
            <th>Tên Sale</th>
            <th class="th-right">Tổng DT</th>
            <th class="th-right">Du học</th>
            <th class="th-right">Đào tạo</th>
            <th class="th-right">Ngoại khoá</th>
            <th class="th-right">Khác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in saleRanking" :key="row.maNV || row.sale" :class="{ 'row-top3': i < 3 }">
            <td class="td-center">
              <span class="rank-badge" :class="rankClass(i)">{{ i + 1 }}</span>
            </td>
            <td class="td-code">{{ row.maNV }}</td>
            <td>{{ row.sale }}</td>
            <td class="td-right td-bold">{{ fmtVND(row.total) }}</td>
            <td class="td-right">{{ row.dh > 0 ? fmtVND(row.dh) : '—' }}</td>
            <td class="td-right">{{ row.daotao > 0 ? fmtVND(row.daotao) : '—' }}</td>
            <td class="td-right">{{ row.ngoaikhoa > 0 ? fmtVND(row.ngoaikhoa) : '—' }}</td>
            <td class="td-right">{{ row.khac > 0 ? fmtVND(row.khac) : '—' }}</td>
          </tr>
          <tr v-if="!saleRanking.length">
            <td colspan="8" class="td-empty">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { fmtVND } from '../../utils/formatters.js'

defineProps({ saleRanking: Array })

const rankClass = (i) => {
  if (i === 0) return 'gold'
  if (i === 1) return 'silver'
  if (i === 2) return 'bronze'
  return ''
}
</script>

<style scoped>
.table-card {
  background: var(--color-white);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-near-black);
  letter-spacing: -0.15px;
}

.chart-subtitle {
  font-size: 11.5px;
  color: var(--color-secondary-gray);
  margin-top: 2px;
}

.table-wrap {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 420px;
}

.rank-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead th {
  position: sticky;
  top: 0;
  background: var(--color-pale-gray);
  padding: 9px 12px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--color-secondary-gray);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--color-soft-border);
  white-space: nowrap;
}

.th-center { text-align: center; }
.th-code   { width: 72px; max-width: 72px; }
.th-right  { text-align: right; }

tbody tr {
  border-bottom: 1px solid #f0f0f2;
  transition: background 0.1s;
}
tbody tr:hover { background: #fafbff; }
tbody tr:last-child { border-bottom: none; }

td {
  padding: 9px 12px;
  color: var(--color-near-black);
  white-space: nowrap;
}

.td-center { text-align: center; }
.td-right  { text-align: right; }
.td-bold   { font-weight: 600; }
.td-code   { font-family: monospace; font-size: 12px; color: var(--color-secondary-gray); width: 72px; max-width: 72px; }
.td-empty  { text-align: center; color: var(--color-secondary-gray); padding: 24px; }

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  background: var(--color-pale-gray);
  color: var(--color-secondary-gray);
}
.rank-badge.gold   { background: #fff0b3; color: #a07800; }
.rank-badge.silver { background: #e8e8ed; color: #48484a; }
.rank-badge.bronze { background: #ffe5d0; color: #9c4a00; }
</style>
