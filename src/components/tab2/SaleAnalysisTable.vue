<!-- Tab2 Chart 6: Phân tích tỷ lệ doanh thu & số lượng đơn hàng từng sale -->
<template>
  <div class="table-card">
    <div class="table-card-header">
      <h3 class="chart-title">Phân tích tỷ lệ doanh thu & số lượng đơn hàng theo Sale</h3>
      <p class="chart-subtitle">Doanh thu sau quà tặng · % so tổng · DT trung bình / đơn</p>
    </div>
    <div class="table-wrap">
      <table class="analysis-table">
        <thead>
          <tr>
            <th class="th-center">STT</th>
            <th>Mã NV</th>
            <th>Tên Sale</th>
            <th class="th-right">Tổng DT</th>
            <th class="th-right">% DT</th>
            <th class="th-right">Số đơn</th>
            <th class="th-right">% Đơn</th>
            <th class="th-right">DT TB/Đơn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in saleAnalysis" :key="row.maNV || row.sale">
            <td class="td-center">{{ i + 1 }}</td>
            <td class="td-code">{{ row.maNV }}</td>
            <td>{{ row.sale }}</td>
            <td class="td-right td-bold">{{ fmtVND(row.totalDT) }}</td>
            <td class="td-right td-pct-cell">
              <span class="pct-bar-wrap">
                <span class="pct-bar" :style="{ width: Math.min(row.pctDT, 100) + '%' }"></span>
              </span>
              <span class="pct-num">{{ row.pctDT.toFixed(1) }}%</span>
            </td>
            <td class="td-right">{{ row.totalDon.toLocaleString('vi-VN') }}</td>
            <td class="td-right">{{ row.pctDon.toFixed(1) }}%</td>
            <td class="td-right">{{ fmtVND(row.dtPerDon) }}</td>
          </tr>
          <tr v-if="!saleAnalysis.length">
            <td colspan="8" class="td-empty">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { fmtVND } from '../../utils/formatters.js'

defineProps({ saleAnalysis: Array })
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
  max-height: 360px;
}

.analysis-table {
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
.th-right  { text-align: right; }

tbody tr {
  border-bottom: 1px solid #f0f0f2;
  transition: background 0.1s;
}
tbody tr:hover { background: #fafbff; }
tbody tr:last-child { border-bottom: none; }

td {
  padding: 8px 12px;
  color: var(--color-near-black);
  white-space: nowrap;
}

.td-center { text-align: center; }
.td-right  { text-align: right; }
.td-bold   { font-weight: 600; }
.td-code   { font-family: monospace; font-size: 12px; color: var(--color-secondary-gray); }
.td-empty  { text-align: center; color: var(--color-secondary-gray); padding: 24px; }

.td-pct-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.pct-bar-wrap {
  width: 60px;
  height: 6px;
  background: #e5e5ea;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}

.pct-bar {
  display: block;
  height: 100%;
  background: var(--color-action-blue);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.pct-num {
  min-width: 42px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-near-black);
}
</style>
