# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

No test, lint, or type-check scripts are configured.

## Tài liệu nghiệp vụ (đọc khi làm việc với báo cáo cụ thể)

| File | Nội dung |
|---|---|
| `.claude/docs/spec-data-model.md` | Khái niệm doanh thu, 8 loại hình, phân loại học sinh, nguồn data — đọc trước |
| `.claude/docs/spec-tab1.md` | Spec chi tiết từng biểu đồ ở Tab1 (KPI, donut, stacked bar, bảng xếp hạng) |
| `.claude/docs/spec-tab2.md` | Spec chi tiết từng biểu đồ ở Tab2 (xu hướng tháng, line chart, active sales) |
| `.claude/docs/chart-rules.md` | Rules kỹ thuật Chart.js: tooltip, scale, datalabels, CSS patterns |
| `.claude/commands/baocao.md` | Skill `/baocao` — workflow implement biểu đồ mới |

## Project Overview

**HienDashboard** là dashboard phân tích doanh thu cho công ty giáo dục Việt Nam. Vue 3 + Vite SPA, không có router — tất cả điều hướng là chuyển tab bên trong một view duy nhất. Không có Vuex/Pinia; state là một `ref` duy nhất trong `src/store/dataStore.js`.

## Architecture & Data Flow

```
Excel (.xlsx)
  → ImportExcelButton.vue
  → excelParser.js (map Vietnamese headers → internal fields)
  → POST /api/save-revenue  ← Vite custom middleware (vite.config.js)
  → ghi ra public/revenue.json

App startup
  → dataStore.js fetch('/revenue.json') → revenueData ref (global)

Khi filter thay đổi (DashboardView.vue)
  → useRevenueData(fromRef, toRef)  ← composable trung tâm
  → tất cả computed aggregations tự động cập nhật
  → truyền xuống chart components qua props
```

### Layer Responsibilities

| Layer | Files | Vai trò |
|---|---|---|
| Store | `src/store/dataStore.js` | Single `revenueData` ref, fetch `/revenue.json` lúc khởi động |
| Composable | `src/composables/useRevenueData.js` | Toàn bộ aggregation logic; trả về computed refs |
| Views | `src/views/` | Layout orchestrators — DashboardView sở hữu tab switching + date filter |
| Components | `src/components/tab1/`, `tab2/` | Các chart card riêng lẻ; nhận pre-computed data qua props |
| Utils | `src/utils/excelParser.js`, `formatters.js` | Parse Excel, format VND |
| Plugin | `src/plugins/stackTotalPlugin.js` | Chart.js plugin vẽ tổng trên stacked bar; đăng ký global trong `main.js` |

## Tab Layouts

### Tab1 — 3 rows × 2 columns

| Row | Left (50%) | Right (50%) |
|---|---|---|
| 1 | `KpiSummaryCard` (5 metrics + progress ring) | `RevenueRatioChart` (donut by loại hình) + `RevenueByCNChart` (donut by branch) |
| 2 | `OrdersByCategoryChart` 50% + `SatIeltsOrdersChart` 25% + `RevenueBySourceChart` 25% | — |
| 3 | `RevenueByTeamChart` (horizontal bar, toggle Team/CN) | `SaleRankingTable` (8 cols: STT, Mã NV, Tên Sale, Tổng DT, Du học, Đào tạo, Ngoại khoá, Khác) |

### Tab2 — 3 rows × 2 columns (fill viewport)

| Row | Left | Right |
|---|---|---|
| 1 | `MonthlyRevenueChart` (stacked: Quà tặng + DT sau quà tặng) | `MonthlyByLoaiChart` (stacked by 8 loại hình) |
| 2 | `MonthlyOrdersChart` (stacked: đkm + ht) | `MonthlyByOrderLoaiChart` (order counts by loại hình) |
| 3 | `MonthlyByTeamChart` (line per sale/team, top-5 + Khác) | `ActiveSalesMonthlyChart` (line: số sale active per month) |

### Tab3 — chưa implement (placeholder)

## useRevenueData.js — Composable Trung Tâm

Nhận `fromRef`, `toRef` (string `"YYYY-MM"`), trả về:

| Export | Kiểu | Mô tả |
|---|---|---|
| `LOAI_HINH` | constant | 8 loại hình kinh doanh |
| `LOAI_LABEL` | constant | Tên hiển thị mỗi loại |
| `LOAI_COLORS` | constant | Màu chart mỗi loại |
| `normalizeLoai()` | function | Map `"Kite"` → `"Công nghệ"` |
| `filtered` | computed | Rows trong date range |
| `totalRevenue` | computed | Tổng theo loại hình |
| `totalDtThucTe` | computed | Tổng dtThucTe |
| `revByCategory` | computed | Breakdown phanLoai × loại hình |
| `revByTeam` / `revByCN` | computed | Doanh thu theo team/chi nhánh |
| `revByCNDtThucTe` | computed | dtThucTe theo chi nhánh (donut) |
| `saleRanking` | computed | Xếp hạng sale (DH, Đào tạo, Ngoại khóa, Khác) |
| `satIeltsOrders` | computed | Số đơn SAT/IELTS theo phanLoai |
| `revBySource` | computed | Doanh thu theo nguồn data |
| `saleAnalysis` | computed | Tỷ lệ % và DT/đơn theo sale |
| `activeSalesByMonth` | computed | Số sale unique per month |
| `byMonth` | computed | Monthly aggregation đầy đủ, top-5 bucketing |

**Conventions:**
- Month format: `"YYYY-MM"` (logic), hiển thị `"ThMM/YY"` (ví dụ `"Th3/25"` = tháng 3/2025)
- `byMonth` luôn generate entry cho mọi tháng trong range, kể cả tháng trống
- Tab2 team/branch charts: top 5 theo tổng doanh thu, còn lại gộp thành `"Khác"`

## Excel Column Mapping

Xem đầy đủ trong `COLUMN_DEFS` ở `src/utils/excelParser.js`. Các field nội bộ quan trọng:

| Internal Field | Nguồn Excel | Ghi chú |
|---|---|---|
| `thang`, `nam` | Tháng/Năm ghi nhận DT | Required — row bị bỏ nếu thiếu |
| `loaiHinh` | Loại hình | 8 types; "Kite" → "Công nghệ" |
| `dtSauQua` | Doanh thu sau quà tặng | Metric doanh thu chính |
| `dtThucTe` | Doanh thu thực tế | Theo nguồn |
| `quaTang` | Quà Tặng | Có thể null |
| `phanLoai` | Phân loại học sinh chuẩn | `"Đăng ký mới"` hoặc `"Hoàn thiện"` |
| `maNV` | Mã nhân viên | Hiển thị trong SaleRankingTable |
| `sale`, `team`, `cn` | SALE, Team, CN | `cn` và `nguon` optional |
| `chiTietMonHoc` | Chi tiết môn học | SAT/IELTS filtering |

## Chart.js Setup (main.js)

- `ChartDataLabels` được đăng ký global nhưng **disabled by default**: `ChartJS.defaults.plugins.datalabels.display = false`
- Bật per-chart bằng cách set `options.plugins.datalabels.display: true`
- `stackTotalPlugin` (custom) đăng ký global — vẽ `fmtVND` tổng trên stacked bar
- `stackTotalPlugin` chỉ chạy khi `chart.config.options.plugins.stackTotal.display !== false`

## Patterns Quan Trọng

**Teleport cho modal/dropdown** — `ImportExcelButton`, `MultiSelect` và `MonthlyByTeamChart` đều dùng `<Teleport to="body">` để tránh overflow clipping trong nested chart containers.

**External HTML tooltip** — `useExternalTooltip.js` dùng trong Tab2 charts (`MonthlyByLoaiChart`, `MonthlyByOrderLoaiChart`, `MonthlyByTeamChart`) thay vì Canvas tooltip của Chart.js, để tránh bị clip.

**Vite custom middleware** — `POST /api/save-revenue` trong `vite.config.js` ghi trực tiếp ra `public/revenue.json`. Chỉ hoạt động trong dev server (`npm run dev`); build production không có API này.

## Thêm Chart Mới

1. Tạo component trong `src/components/tab1/` hoặc `tab2/`
2. Lấy data từ `useRevenueData()` — bổ sung composable nếu cần aggregation mới
3. Wrap trong `ChartCard.vue` (có title + slot)
4. Đặt vào grid row tương ứng trong `Tab1View` hoặc `Tab2View`

## Components Không Dùng

`src/components/dashboard/` (StatCard, DonutChartCard, PersonnelCountChart, PersonnelChangeChart) — các placeholder cũ, không được mount ở đâu cả.
