# Tab1 — Báo cáo Tổng quan Kỳ lọc

Tab1 trả lời câu hỏi: **"Trong khoảng thời gian đã chọn, tình hình kinh doanh như thế nào?"**
Toàn bộ số liệu là tổng hợp (aggregate) của kỳ lọc, không phân tách theo thời gian.

Xem `.claude/docs/spec-data-model.md` để hiểu các khái niệm doanh thu, loại hình, phân loại học sinh.

---

## Layout

```
┌─────────────────────────────┬──────────────────────────────────────┐
│  [1] KPI Summary Card       │  [2] Donut Loại hình                 │
│                             │  [3] Donut Chi nhánh                 │
├──────────────┬──────────────┴──────────────────────────────────────┤
│  [4] SAT/    │  [5] Doanh thu theo Team/CN (horizontal bar)        │
│     IELTS    ├─────────────────────────────────────────────────────┤
│  [6] Nguồn   │  [7] Xếp hạng Sale (table)                         │
└──────────────┴─────────────────────────────────────────────────────┘
```

> Thực tế Row 2 gồm 3 phần: [Số lượng đơn loại hình 50%] + [SAT/IELTS 25%] + [Nguồn 25%]

---

## [1] KPI Summary Card

**Component:** `src/components/tab1/KpiSummaryCard.vue`
**Mục đích:** Nhìn thoáng qua 5 chỉ số quan trọng nhất của kỳ lọc.

### 5 chỉ số

| Chỉ số | Field | Cách tính |
|---|---|---|
| Tổng doanh thu | `totalDtThucTe` | Tổng `dtThucTe` tất cả bản ghi trong kỳ |
| Tổng quà tặng | từ `totalRevenue` | Tổng `quaTang` tất cả loại hình |
| DT sau quà tặng | từ `totalRevenue` | Tổng `dtSauQua` tất cả loại hình |
| Số đơn hàng mới | `count_dkm` tổng các loại | Đếm bản ghi có `phanLoai = "Đăng ký mới"` |
| Số đơn hàng hoàn thiện | `count_ht` tổng các loại | Đếm bản ghi có `phanLoai = "Hoàn thiện"` |

### Ring indicator
Vòng tròn tiến độ bên cạnh "Tổng doanh thu":
- **Giá trị:** `dtSauQua / dtThucTe × 100%`
- **Đọc:** Ring càng đầy = tỷ lệ chiết khấu/quà tặng càng thấp = doanh thu "sạch" càng cao
- Ví dụ: Ring 80% → 20% doanh thu thực tế là quà tặng/discount

---

## [2] Doanh thu từng loại hình (Donut)

**Component:** `src/components/tab1/RevenueRatioChart.vue`
**Subtitle:** "Doanh thu: DT sau quà tặng, Loại hình"
**Mục đích:** Thấy ngay loại hình nào đang chiếm tỷ trọng lớn nhất trong doanh thu.

- **Metric:** `dtSauQua` tổng theo từng loại hình trong 8 loại
- **Hiển thị:** Legend gồm tên loại hình + số tiền + % tổng
- **Lọc:** Chỉ hiển thị các loại hình có doanh thu > 0
- **Màu:** Theo `LOAI_COLORS`

**Cách đọc:** Loại hình chiếm % cao nhất là nguồn doanh thu chủ lực. So sánh tỷ lệ giữa DH, KH, Kids để thấy cơ cấu sản phẩm.

---

## [3] Doanh thu theo chi nhánh (Donut)

**Component:** `src/components/tab1/RevenueByCNChart.vue`
**Subtitle:** "Doanh thu: DT thực tế, CN"
**Mục đích:** Thấy chi nhánh nào đóng góp doanh thu nhiều nhất.

- **Metric:** `dtThucTe` tổng theo cột `cn` (chi nhánh)
- **Hiển thị:** Legend gồm tên CN + số tiền + %
- **Khác biệt với donut loại hình:** Dùng `dtThucTe` (không phải `dtSauQua`) vì muốn phản ánh tổng giá trị khách cam kết, không bị ảnh hưởng bởi policy quà tặng của từng CN

---

## [4] Số lượng đơn hàng theo loại hình (Stacked Bar)

**Component:** `src/components/tab1/OrdersByCategoryChart.vue`
**Subtitle:** "Số đơn hàng: Loại hình, Phân loại học sinh"
**Mục đích:** So sánh số lượng đơn giữa các loại hình và thấy tỷ lệ đơn mới vs hoàn thiện.

- **Trục X:** 8 loại hình
- **Trục Y:** Số lượng đơn (count)
- **Stack dưới:** "Đăng ký mới" (màu xanh dương) — dùng field `count_dkm`
- **Stack trên:** "Hoàn thiện" (màu xanh lá) — dùng field `count_ht`
- **Số trên đỉnh:** Tổng đơn của loại hình đó (stackTotalPlugin)
- **Data labels:** Số lượng bên trong từng phần bar

**Cách đọc:** Cột cao = loại hình có nhiều đơn. Phần "Đăng ký mới" cao = nhiều khách mới. Phần "Hoàn thiện" cao = nhiều khách cũ đang thanh toán nốt.

---

## [5] Số lượng đơn hàng SAT / IELTS (Stacked Bar)

**Component:** `src/components/tab1/SatIeltsOrdersChart.vue`
**Subtitle:** "Số đơn hàng: Loại hình KH, Chi tiết môn học"
**Mục đích:** Drill-down vào mảng luyện thi — so sánh SAT vs IELTS.

- **Lọc dữ liệu:** Chỉ lấy bản ghi có `loaiHinh = "KH"` VÀ `chiTietMonHoc = "SAT"` hoặc `"IELTS"`
- **Trục X:** 2 cột: SAT, IELTS
- **Stack dưới:** "Hoàn thiện" — số đơn `phanLoai = "Hoàn thiện"`
- **Stack trên:** "Đăng ký mới" — số đơn `phanLoai = "Đăng ký mới"`
- **Số trên đỉnh:** Tổng đơn SAT hoặc IELTS

**Cách đọc:** So sánh tổng đơn SAT vs IELTS để thấy môn nào được đăng ký nhiều hơn. Tỷ lệ "Đăng ký mới" / "Hoàn thiện" cho thấy giai đoạn học của học sinh.

> **Lưu ý:** Các đơn KH không có `chiTietMonHoc = SAT/IELTS` (ví dụ: TOEIC, tiếng Anh giao tiếp) **không xuất hiện** ở biểu đồ này.

---

## [6] Doanh thu theo nguồn data (Donut)

**Component:** `src/components/tab1/RevenueBySourceChart.vue`
**Subtitle:** "Doanh thu: DT thực tế, Nguồn"
**Mục đích:** Thấy kênh marketing/nguồn nào mang về doanh thu nhiều nhất.

- **Metric:** `dtThucTe` tổng theo cột `nguon` (Phân loại nguồn data)
- **Giá trị null** trong Excel → gộp vào bucket `"Khác"`
- **Hiển thị:** Legend tên nguồn + số tiền + %
- **Ví dụ nguồn:** Facebook, HSĐH (Học sinh du học cũ giới thiệu), referral, v.v.

**Cách đọc:** Nguồn chiếm % cao → kênh hiệu quả nhất. Dùng để ra quyết định phân bổ ngân sách marketing.

---

## [7] Doanh thu theo Team / Chi nhánh (Horizontal Bar)

**Component:** `src/components/tab1/RevenueByTeamChart.vue`
**Subtitle:** "Doanh thu: DT sau quà tặng"
**Mục đích:** So sánh hiệu suất giữa các team hoặc chi nhánh.

- **Metric:** `dtSauQua` tổng theo team hoặc CN
- **Toggle:** Combobox chọn **Team** hoặc **Chi nhánh (CN)**
  - Khi chọn Team → dữ liệu từ `revByTeam`
  - Khi chọn CN → dữ liệu từ `revByCN`
- **Sắp xếp:** Từ cao đến thấp
- **Tooltip:** Hiển thị % trên tổng
- **Chiều cao chart:** Tự động scale theo số lượng items (20px/item)

**Cách đọc:** Bar dài = team/CN doanh thu cao nhất. % trong tooltip giúp so sánh tương đối.

---

## [8] Xếp hạng doanh số Sale (Table)

**Component:** `src/components/tab1/SaleRankingTable.vue`
**Mục đích:** Xếp hạng cá nhân từng sale, thấy ai đang làm tốt và đóng góp ở mảng nào.

### Cấu trúc bảng

| Cột | Dữ liệu | Ghi chú |
|---|---|---|
| STT | Thứ tự | Top 3 có huy chương vàng/bạc/đồng |
| Mã NV | `maNV` | Mã nhân viên từ Excel |
| Tên Sale | `sale` | Tên nhân viên |
| Tổng DT | `total` | Tổng `dtSauQua` của sale đó |
| Du học | `dh` | `dtSauQua` từ loại hình `DH` |
| Đào tạo | `daotao` | `dtSauQua` từ `KH` + `Kids` + `Debate` |
| Ngoại khóa | `ngoaikhoa` | `dtSauQua` từ `NK` + `Công nghệ` (gồm Kite) |
| Khác | `khac` | `dtSauQua` từ `Camp` + `Commission` + loại không xác định |

- **Sắp xếp:** Theo `total` từ cao xuống thấp
- **Scroll:** Bảng có scroll dọc, header sticky

**Cách đọc:** Nhìn cột "Tổng DT" để thấy xếp hạng. Nhìn các cột chi tiết để thấy sale giỏi mảng nào (Du học chuyên, hay Đào tạo mạnh, v.v.).
