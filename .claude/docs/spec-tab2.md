# Tab2 — Xu hướng theo Tháng

Tab2 trả lời câu hỏi: **"Trong kỳ lọc, doanh thu và hoạt động kinh doanh biến động như thế nào qua từng tháng?"**
Trục X của tất cả biểu đồ là các tháng trong kỳ lọc — kể cả tháng không có dữ liệu (hiển thị 0).

Tab2 dùng chung Date_Filter với Tab1 (không có filter riêng).
Xem `.claude/docs/spec-data-model.md` để hiểu các khái niệm cơ bản.

---

## Layout

```
┌──────────────────────────────┬──────────────────────────────────┐
│  [1] Tổng doanh thu          │  [2] Số lượng đơn hàng           │
├──────────────────────────────┼──────────────────────────────────┤
│  [3] Doanh thu theo loại hình│  [4] Biến động DT theo Team      │
├──────────────────────────────┼──────────────────────────────────┤
│  [5] Số lượng sale hoạt động │  [trống]                         │
└──────────────────────────────┴──────────────────────────────────┘
```

Mỗi hàng chiều cao bằng nhau, lấp đầy viewport, không scroll.

---

## [1] Tổng doanh thu (Stacked Bar)

**Component:** `src/components/tab2/MonthlyRevenueChart.vue`
**Subtitle:** "Tổng doanh thu: Quà tặng, DT sau quà tặng"
**Mục đích:** Thấy tổng doanh thu từng tháng và cơ cấu quà tặng vs doanh thu thực.

- **Trục X:** Các tháng trong kỳ lọc (label: `"Th7/24"`, `"Th8/24"`, ...)
- **Trục Y:** Số tiền (VND)
- **Stack dưới:** "Quà Tặng" (màu cam) — field `quaTang`
- **Stack trên:** "DT sau quà tặng" (màu xanh dương) — field `dtSauQua`
- **Số trên đỉnh:** Tổng 2 stack = `dtThucTe` của tháng đó (stackTotalPlugin)
- **MultiSelect:** Toggle bật/tắt từng dataset (Quà Tặng / DT sau quà tặng)

**Cách đọc:**
- Cột cao = tháng doanh thu tốt
- Phần cam dày = tháng đó khuyến mãi/quà tặng nhiều, doanh thu "sạch" ít hơn
- Xu hướng: tháng nào cột tăng đột biến → chiến dịch bán hàng hiệu quả

---

## [2] Số lượng đơn hàng (Stacked Bar)

**Component:** `src/components/tab2/MonthlyOrdersChart.vue`
**Subtitle:** "Số đơn hàng: Theo đăng ký mới và hoàn thiện"
**Mục đích:** Thấy số lượng đơn hàng từng tháng và tỷ lệ đơn mới vs hoàn thiện.

- **Trục X:** Các tháng trong kỳ lọc
- **Trục Y:** Số đơn (count)
- **Stack dưới:** "Đăng ký mới" — field `donDkm` (đếm bản ghi có `phanLoai = "Đăng ký mới"`)
- **Stack trên:** "Hoàn thiện" — field `donHt` (đếm bản ghi có `phanLoai = "Hoàn thiện"`)
- **Số trên đỉnh:** Tổng đơn tháng đó (stackTotalPlugin)
- **MultiSelect:** Toggle bật/tắt từng dataset

**Cách đọc:**
- Phần "Đăng ký mới" cao = tháng đó acquisition khách mới tốt
- Phần "Hoàn thiện" cao = nhiều học sinh cũ đang trong quá trình thanh toán nốt
- So sánh với biểu đồ [1]: nếu đơn nhiều nhưng doanh thu thấp → giá trị đơn thấp (Camp, NK) hoặc nhiều hoàn thiện giá nhỏ

---

## [3] Doanh thu theo loại hình (Stacked Bar)

**Component:** `src/components/tab2/MonthlyByLoaiChart.vue`
**Subtitle:** "Doanh thu: DT sau quà tặng, Loại hình"
**Mục đích:** Thấy cơ cấu loại hình trong từng tháng và xu hướng tăng trưởng của từng mảng.

- **Trục X:** Các tháng trong kỳ lọc
- **Trục Y:** Số tiền (VND)
- **8 stack:** Mỗi loại hình 1 màu riêng (theo LOAI_COLORS), dùng `byLoai[loaiHinh]`
- **MultiSelect:** Toggle bật/tắt từng loại hình
- **Legend:** Grid 4 cột hiển thị cùng hàng với tiêu đề
- **Tooltip:** HTML external tooltip, hiển thị từng loại + % tổng tháng đó

**Cách đọc:**
- Màu nào chiếm diện tích lớn nhất = loại hình đóng góp nhiều nhất tháng đó
- Theo dõi màu DH (xanh dương) và KH (xanh lá) qua nhiều tháng để thấy xu hướng chủ lực
- Tháng nào màu Camp (vàng) xuất hiện nhiều → mùa trại hè
- Dùng MultiSelect tắt các loại nhỏ để nhìn rõ hơn loại cần theo dõi

---

## [4] Số lượng đơn theo loại hình (Stacked Bar)

**Component:** `src/components/tab2/MonthlyByOrderLoaiChart.vue`
**Subtitle:** "Số đơn hàng: DT sau quà tặng, Loại hình" *(hiển thị số đơn, không phải tiền)*
**Mục đích:** Tương tự [3] nhưng xem về **số lượng đơn** thay vì doanh thu — phát hiện loại hình nhiều đơn nhỏ tiền vs ít đơn lớn tiền.

- **Trục X:** Các tháng trong kỳ lọc
- **Trục Y:** Số đơn (count)
- **8 stack:** Dùng `byLoaiCount[loaiHinh]` — đếm số bản ghi
- **Tooltip:** HTML external tooltip, hiển thị số đơn + %

**Cách đọc:**
- So sánh với [3]: loại hình có nhiều đơn nhưng doanh thu thấp → giá trị đơn thấp (ví dụ: NK, Camp)
- Loại hình ít đơn nhưng doanh thu cao → đơn có giá trị lớn (ví dụ: DH)
- Dùng để phân tích năng suất sale: đơn nhiều hay đơn to?

---

## [5] Biến động doanh thu theo Team (Line Chart)

**Component:** `src/components/tab2/MonthlyByTeamChart.vue`
**Subtitle:** "Doanh thu: DT sau quà tặng, Team, Sale"
**Mục đích:** Theo dõi hiệu suất từng nhân viên trong một team qua từng tháng.

- **Combobox:** Chọn team (danh sách team lấy từ dữ liệu thực)
- **Mỗi đường = 1 sale** trong team được chọn
- **Metric:** `dtSauQua` tổng theo sale theo từng tháng
- **Tooltip:** HTML external tooltip, hiển thị tên sale + số tiền
- **Legend:**
  - Hiển thị tên sale với chấm màu
  - Nếu quá nhiều sale → wrap 2 dòng, phần dư hiển thị badge `+N`
  - Hover vào `+N` → popup danh sách sale bị ẩn kèm màu tương ứng
- **Top-5 bucketing KHÔNG áp dụng** ở đây — hiển thị tất cả sale trong team được chọn

**Cách đọc:**
- Đường đi lên đều = sale tăng trưởng ổn định
- Đường giao động mạnh = sale không ổn định (cần hỏi lý do)
- Sale có đường nằm ngang dưới thấp nhiều tháng → có thể đang gặp vấn đề
- So sánh các đường trong cùng team để thấy ai đang outperform

---

## [6] Số lượng sale hoạt động (Line Chart)

**Component:** `src/components/tab2/ActiveSalesMonthlyChart.vue`
**Subtitle:** "Số nhân viên: Sale"
**Mục đích:** Theo dõi số lượng nhân viên sale thực sự có phát sinh doanh thu mỗi tháng.

- **1 đường duy nhất**
- **Metric:** `activeSales` — đếm số `sale` **unique** có ít nhất 1 bản ghi trong tháng đó
- **Data labels:** Hiển thị số trực tiếp trên mỗi điểm
- **Filled area:** Nền xanh nhạt bên dưới đường

**Cách đọc:**
- Tháng nào số sale giảm đột ngột → có thể có người nghỉ việc hoặc không chốt được đơn
- Tháng nào số sale tăng → team mở rộng hoặc có onboard mới
- Kết hợp với biểu đồ [1] (tổng doanh thu): nếu doanh thu tăng nhưng số sale giảm → năng suất bình quân/người tăng
- Lưu ý: sale chỉ được đếm nếu **có đơn hàng** trong tháng đó, không phải chỉ có mặt trong danh sách nhân sự

---

## Bảng Phân tích tỷ lệ Sale (SaleAnalysisTable)

**Component:** `src/components/tab2/SaleAnalysisTable.vue`
**Trạng thái:** Đã build nhưng **không được mount** trong Tab2View hiện tại (theo brief: bảng này không hiển thị ở Tab2).

Nếu cần dùng lại, bảng này hiển thị:

| Cột | Ý nghĩa |
|---|---|
| Mã NV / Tên Sale | Nhân viên |
| Tổng DT | Tổng `dtSauQua` |
| % DT | % trên tổng doanh thu (progress bar) |
| Số đơn | Tổng số bản ghi |
| % Đơn | % trên tổng số đơn (progress bar) |
| DT TB/Đơn | `totalDT / totalDon` — giá trị trung bình mỗi đơn |

---

## Lưu ý chung Tab2

- **Trục X hiển thị tất cả tháng** dù không có dữ liệu — đây là thiết kế cố ý để thấy "khoảng trống"
- **Top-5 bucketing** áp dụng cho `byTeam` và `byCN` trong `byMonth` — nhưng biểu đồ [5] không dùng bucketing, dùng data sale thực
- **Không có filter riêng ở Tab2** — tất cả dùng chung Date_Filter của DashboardView
