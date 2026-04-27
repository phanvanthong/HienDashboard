# Hướng dẫn cấu hình Google Service Account

Cho phép dashboard tự động tải dữ liệu từ Google Sheet **riêng tư** (không cần public link).

---

## Bước 1 — Bật API trên Google Cloud

1. Vào [console.cloud.google.com](https://console.cloud.google.com)
2. Chọn project muốn dùng (hoặc tạo mới nếu chưa có)
3. Click **APIs & Services** → **Enable APIs and Services**
4. Tìm **"Google Drive API"** → Enable
5. Quay lại, tìm **"Google Sheets API"** → Enable

---

## Bước 2 — Tạo Service Account

1. Vào **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → chọn **Service account**
3. Đặt tên (ví dụ: `hien-dashboard`) → click **Create and continue**
4. Bỏ qua bước "Grant access" và "Grant users access" → click **Done**

---

## Bước 3 — Tải JSON Key

1. Ở trang Credentials, click vào service account vừa tạo
2. Chọn tab **Keys**
3. Click **Add Key** → **Create new key** → chọn **JSON** → **Create**
4. File JSON tự động tải về máy — **giữ file này an toàn, không chia sẻ cho ai**

> File JSON có dạng:
> ```json
> {
>   "type": "service_account",
>   "project_id": "...",
>   "client_email": "hien-as@gen-lang-client-0286474839.iam.gserviceaccount.com",
>   "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...",
>   ...
> }
> ```

---

## Bước 4 — Chia sẻ Google Sheet với Service Account

1. Mở file Google Sheet cần kết nối
2. Click nút **Chia sẻ** (góc trên phải)
3. Nhập **email của service account** từ file JSON (trường `client_email`)
   - Ví dụ: `hien-as@gen-lang-client-0286474839.iam.gserviceaccount.com`
4. Chọn quyền **Người xem (Viewer)**
5. Bỏ chọn "Thông báo cho mọi người" → click **Chia sẻ**

> File Google Sheet vẫn **riêng tư** với tất cả mọi người — chỉ có dashboard mới đọc được qua service account.

---

## Bước 5 — Cấu hình trong Dashboard

1. Mở dashboard → click icon **⚙** (Cài đặt nguồn dữ liệu)
2. Chọn **Google Drive / Google Sheets**
3. Dán link Google Sheet vào ô **Link Google Drive / Google Sheets**
4. Mở rộng mục **Service Account (cho file hạn chế)**
5. Mở file JSON key vừa tải bằng Notepad hoặc VS Code
6. Chọn tất cả (Ctrl+A) → Copy → Paste vào textarea
7. Click **Lưu key**
8. Trạng thái chuyển sang **✓ Đã cấu hình** với email service account

---

## Thiết lập tự động cập nhật (tuỳ chọn)

Ở mục **Tự động cập nhật**, chọn tần suất mong muốn:

| Tùy chọn | Mô tả |
|---|---|
| Tắt | Chỉ tải khi bấm "Cập nhật dữ liệu" thủ công |
| 1 phút | Tự động tải lại mỗi 1 phút |
| 5 phút | Tự động tải lại mỗi 5 phút |
| 15 phút | Tự động tải lại mỗi 15 phút |
| 30 phút | Tự động tải lại mỗi 30 phút |

> Dashboard tự động tải dữ liệu mỗi khi mở lại trang (nếu đã cấu hình URL).

---

## Lưu ý bảo mật

- File `.service-account.json` được lưu **trên máy tính**, không bị commit lên git
- Không chia sẻ file JSON key cho người khác
- Nếu muốn thu hồi quyền truy cập: xóa key trong Google Cloud → **Credentials** → chọn service account → tab Keys → xóa key tương ứng
