# Mô hình dữ liệu & Khái niệm nghiệp vụ

File này định nghĩa các thuật ngữ, chỉ số, và phân loại dùng xuyên suốt toàn bộ dashboard.
Đọc file này trước khi đọc spec của bất kỳ báo cáo nào.

---

## Nguồn dữ liệu

Dữ liệu được nhập từ file Excel qua nút **Import Excel** ở góc trên phải dashboard.
File Excel sau khi parse được lưu tại `public/revenue.json` và load vào `revenueData` ref (global store).

Mỗi bản ghi = 1 đơn hàng của 1 học sinh, ghi nhận trong 1 tháng cụ thể.

---

## Bộ lọc thời gian (Date_Filter)

- Hai ô chọn **Từ tháng** / **Đến tháng** nằm trên header của DashboardView
- Format nội bộ: `"YYYY-MM"` (ví dụ `"2024-07"`)
- Hiển thị trên trục X biểu đồ: `"ThM/YY"` (ví dụ `"Th7/24"` = tháng 7/2024)
- Áp dụng cho cả Tab1 và Tab2 — Tab2 không có filter riêng
- Lọc theo cột **Tháng ghi nhận doanh thu** + **Năm ghi nhận doanh thu** trong Excel

---

## 3 chỉ số doanh thu cốt lõi

| Tên hiển thị | Field nội bộ | Cột Excel | Ý nghĩa |
|---|---|---|---|
| Doanh thu thực tế | `dtThucTe` | Doanh thu thực tế | Tổng tiền khách thực sự cam kết trả (giá gốc trước chiết khấu) |
| Quà tặng | `quaTang` | Quà Tặng | Phần công ty khuyến mãi/giảm giá cho khách |
| DT sau quà tặng | `dtSauQua` | Doanh thu sau quà tặng | Doanh thu thực công ty thu được = dtThucTe − quaTang |

**Quan hệ:** `dtThucTe = dtSauQua + quaTang`

**Chỉ số nào dùng ở đâu:**
- `dtSauQua` → metric chính để so sánh hiệu suất sale, xếp hạng team, phân tích xu hướng
- `dtThucTe` → dùng cho donut chi nhánh, donut nguồn data, KPI "Tổng doanh thu"
- `quaTang` → dùng kết hợp với `dtSauQua` trong biểu đồ stacked bar tổng doanh thu (Tab2)

**Ring indicator trên KPI card:**
`dtSauQua / dtThucTe × 100%` = tỷ lệ doanh thu "sạch" trên tổng doanh thu khách cam kết.
Ví dụ ring = 85% nghĩa là 15% doanh thu được discount/quà tặng.

---

## 8 Loại hình kinh doanh

| Code | Tên hiển thị | Màu | Mô tả |
|---|---|---|---|
| `DH` | Du học | #0071e3 (xanh dương) | Tư vấn và dịch vụ du học nước ngoài |
| `KH` | Khoá học | #34c759 (xanh lá) | Khoá luyện thi (SAT, IELTS, v.v.) |
| `Kids` | Kids | #ff9500 (cam) | Chương trình học dành cho trẻ em |
| `Debate` | Debate | #af52de (tím) | Lớp học kỹ năng tranh luận |
| `NK` | Ngoại khoá | #ff6b6b (đỏ nhạt) | Hoạt động ngoại khoá, kỹ năng mềm |
| `Công nghệ` | Công nghệ | #5ac8fa (xanh nhạt) | STEM, lập trình (bao gồm tên cũ "Kite") |
| `Camp` | Trại hè | #ffcc02 (vàng) | Chương trình trại hè |
| `Commission` | Commission | #8e8e93 (xám) | Hoa hồng, không phải doanh thu trực tiếp |

> **Lưu ý:** Dữ liệu Excel có thể ghi là `"Kite"` — hệ thống tự động normalize thành `"Công nghệ"` trong `normalizeLoai()`.

---

## Phân loại học sinh (phanLoai)

| Giá trị | Ý nghĩa |
|---|---|
| `Đăng ký mới` (dkm) | Học sinh đăng ký lần đầu, đơn hàng mới hoàn toàn |
| `Hoàn thiện` (ht) | Học sinh hoàn thiện học phí còn lại / thanh toán nốt đơn cũ |

> Trường `phanLoai` dùng để đếm số đơn.
> Trường `phanLoaiHS` dùng để tính doanh thu (dtThucTe) theo loại.
> Hai trường này về nghĩa giống nhau nhưng được dùng ở các aggregation khác nhau.

---

## Nhóm loại hình trong Xếp hạng Sale

Bảng xếp hạng sale chia doanh thu thành 4 nhóm:

| Cột bảng | Loại hình tương ứng |
|---|---|
| Du học | `DH` |
| Đào tạo | `KH`, `Kids`, `Debate` |
| Ngoại khóa | `NK`, `Công nghệ` (gồm cả "Kite") |
| Khác | `Camp`, `Commission`, và các loại không xác định |

---

## Phân loại nguồn data (nguon)

Cột **Phân loại nguồn data** trong Excel ghi nguồn khách hàng đến từ đâu.
Ví dụ: Facebook, HSĐH (Học sinh du học), referral, v.v.
Giá trị `null` được gộp thành `"Khác"` trong biểu đồ nguồn data.

---

## Tổ chức nhân sự

| Field | Cột Excel | Ý nghĩa |
|---|---|---|
| `sale` | SALE | Tên nhân viên sale |
| `maNV` | Mã NV | Mã nhân viên (dùng làm key unique thay cho tên) |
| `team` | Team | Team của sale (ví dụ: "Team Liên", "Team A") |
| `cn` | CN | Chi nhánh (ví dụ: "HN", "HCM") |

---

## SAT / IELTS

Là subset của loại hình `KH` (Khoá học luyện thi).
Lọc bằng cột **Chi tiết môn học** = `"SAT"` hoặc `"IELTS"`.
Các bản ghi `KH` không có `chiTietMonHoc` = SAT/IELTS không xuất hiện trong biểu đồ SAT/IELTS.

---

## Top-5 bucketing (chỉ áp dụng Tab2)

Biểu đồ theo team/chi nhánh ở Tab2 chỉ hiển thị **5 team/CN có tổng dtSauQua cao nhất** trong kỳ lọc.
Tất cả còn lại gộp vào một bucket tên `"Khác"`.
Top-5 được tính trên **toàn bộ kỳ lọc**, không tính lại từng tháng.

---

## Tháng trống

Tab2 luôn hiển thị **tất cả các tháng trong kỳ lọc**, kể cả tháng không có bất kỳ đơn hàng nào.
Tháng trống sẽ có giá trị 0 trên tất cả các biểu đồ.
