Implement báo cáo/biểu đồ mới cho HienDashboard: $ARGUMENTS

## Workflow

**1. Đọc context nghiệp vụ**
- `.claude/docs/spec-data-model.md` — metric, loại hình, phân loại học sinh
- Tab1 → `.claude/docs/spec-tab1.md` | Tab2 → `.claude/docs/spec-tab2.md`
- `src/composables/useRevenueData.js` — xem computed nào đã có

**2. Đọc component mẫu cùng loại** (để copy pattern chính xác)

| Loại | File mẫu |
|---|---|
| Stacked bar theo tháng | `src/components/tab2/MonthlyRevenueChart.vue` |
| Stacked bar 8 loại hình | `src/components/tab2/MonthlyByLoaiChart.vue` |
| Stacked bar snapshot Tab1 | `src/components/tab1/OrdersByCategoryChart.vue` |
| Donut | `src/components/tab1/RevenueRatioChart.vue` |
| Line chart | `src/components/tab2/MonthlyByTeamChart.vue` |
| Horizontal bar | `src/components/tab1/RevenueByTeamChart.vue` |
| Bảng | `src/components/tab1/SaleRankingTable.vue` |

Nếu cần rules kỹ thuật đầy đủ (tooltip config, scale config, CSS patterns, datalabels, v.v.) → đọc `.claude/docs/chart-rules.md`.

**3. Implement** theo đúng pattern của mẫu đã đọc. Các điểm không được sai:
- Props Array/Object luôn có default; không gọi store/composable trong component
- Tab2 → external tooltip (`useExternalTooltip`); Tab1 → canvas tooltip
- Stacked bar → `stackTotalPlugin` + `layout.padding.top: 18` + `stack: 'total'`
- Popup/dropdown → `<Teleport to="body">` + `<style>` không scoped

**4. Cập nhật `useRevenueData.js`** nếu cần aggregation mới (thêm vào cuối, export trong return)

**5. Mount vào View** — đọc `Tab1View.vue` hoặc `Tab2View.vue`, import + đặt đúng ô grid + truyền props

**6. Checklist trước khi xong**
- [ ] subtitle mô tả đúng cột Excel đang dùng
- [ ] Màu loại hình từ `LOAI_COLORS`, không hardcode tùy tiện
- [ ] Component đã được mount trong View
