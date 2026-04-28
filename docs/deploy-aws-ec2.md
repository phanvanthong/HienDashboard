# Deploy HienDashboard lên AWS EC2 Free Tier

## Chọn loại deploy

| | Loại 1 — Chỉ IP | Loại 2 — Domain + HTTPS |
|---|---|---|
| **Truy cập** | `http://<IP>:3000` | `https://yourdomain.com` |
| **Yêu cầu** | Chỉ cần tài khoản AWS | AWS + tên miền |
| **HTTPS** | Không | Có (Let's Encrypt) |
| **Phù hợp** | Dùng nội bộ, test | Public, production |
| **Các bước** | Phần 1 → 2 → 3 → 4 → 6 → 7 | Phần 1 → 2 → 3 → 4 → 5 → 6 → 7 |

---

## Phần 1 — Tạo EC2 Instance

1. Vào [AWS Console](https://console.aws.amazon.com/) → **EC2** → **Launch Instance**
2. Cấu hình:
   - **AMI**: Amazon Linux 2023
   - **Instance type**: `t2.micro` (free tier)
   - **Key pair**: Tạo mới, download file `.pem` về máy
   - **Security Group**: Mở port tương ứng với loại deploy

**Loại 1 (chỉ IP):**

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | 0.0.0.0/0 |
| Custom TCP | 3000 | 0.0.0.0/0 |

**Loại 2 (domain + HTTPS):**

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | 0.0.0.0/0 |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

3. Launch → lưu lại **Public IP** của instance

> **Giữ IP cố định:** AWS Console → **Elastic IPs** → Allocate → Associate với instance. Miễn phí khi gắn vào instance đang chạy.

---

## Phần 2 — Kết nối SSH & Cài Node.js

```bash
# Kết nối vào EC2
ssh -i docs/web-server-aws.pem ec2-user@15.134.34.133

# Cài Node.js 20 LTS
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Cài PM2 (process manager — tự restart nếu crash, tự chạy khi reboot)
sudo npm install -g pm2

# Cài git
sudo yum install -y git
```

---

## Phần 3 — Deploy Code

**Cách A — Clone từ GitHub (khuyên dùng):**

```bash
git clone https://github.com/<user>/HienDashboard.git
cd HienDashboard
```

**Cách B — Upload từ máy Windows (nếu chưa có GitHub):**

Chạy lệnh này **trên máy local** (Git Bash hoặc WSL):

```bash
scp -i docs/web-server-aws.pem -r D:/Develop/HienDashboard ec2-user@15.134.34.133:~/
```

---

## Phần 4 — Build & Chạy Server

```bash
cd ~/HienDashboard

npm install          # cài dependencies
npm run build        # build Vue app ra dist/

pm2 start server.js --name hien-dashboard
pm2 startup          # tự chạy khi EC2 reboot
pm2 save
```

---

## ✦ Loại 1 — Truy cập qua IP (dừng ở đây)

```
http://15.134.34.133:3000
```

Xong. Tiếp tục phần 6 để upload Google Drive key.

---

## ✦ Loại 2 — Nginx + HTTPS (tiếp tục từ đây)

### Phần 5.1 — Trỏ domain về EC2

Trong DNS Manager của nhà cung cấp domain, thêm 2 record:

```
A    yourdomain.com      15.134.34.133
A    www.yourdomain.com  15.134.34.133
```

Chờ ~5–15 phút cho DNS propagate.

### Phần 5.2 — Cài và cấu hình Nginx

```bash
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Tạo file config:

```bash
sudo nano /etc/nginx/conf.d/hien-dashboard.conf
```

Paste nội dung sau (thay `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50m;
    }
}
```

```bash
sudo nginx -t                  # kiểm tra config hợp lệ
sudo systemctl reload nginx
```

### Phần 5.3 — Lấy SSL Certificate

```bash
sudo yum install -y python3-certbot-nginx

sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot tự sửa config Nginx sang HTTPS và cài cron job gia hạn tự động (90 ngày/lần).

Kiểm tra gia hạn:

```bash
sudo certbot renew --dry-run
```

Kết quả: `https://yourdomain.com` → HienDashboard qua SSL.

---

## Phần 6 — Upload Service Account Key (Google Drive)

File `Hien-AS.service-account.json` không được commit lên git. Sau khi deploy, upload thủ công từ máy local:

```bash
scp -i docs/web-server-aws.pem D:/Develop/HienDashboard/Hien-AS.service-account.json \
  ec2-user@15.134.34.133:~/HienDashboard/
```

---

## Phần 7 — Cập nhật Code

```bash
cd ~/HienDashboard
git pull                        # lấy code mới
npm install                     # nếu package.json thay đổi
npm run build                   # rebuild frontend
pm2 restart hien-dashboard
```

---

## Lệnh PM2 hữu ích

```bash
pm2 list                        # xem trạng thái
pm2 logs hien-dashboard         # xem log realtime
pm2 restart hien-dashboard      # restart
pm2 stop hien-dashboard         # dừng
```

---

## Phần 8 — CI/CD tự động với GitHub Actions

Mỗi khi push lên nhánh `main`, GitHub Actions sẽ tự SSH vào EC2, pull code, build và restart.

File workflow đã có sẵn tại `.github/workflows/deploy.yml`.

### 8.1 — Chuẩn bị GitHub Secrets

Vào GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, thêm 2 secrets:

| Secret | Giá trị |
|--------|---------|
| `EC2_HOST` | `15.134.34.133` |
| `EC2_SSH_KEY` | Nội dung file `web-server-aws.pem` (copy toàn bộ kể cả dòng `-----BEGIN...-----`) |

**Lấy nội dung file `.pem`** (chạy trên máy local — Git Bash):

```bash
cat D:/Develop/HienDashboard/docs/web-server-aws.pem
```

Copy toàn bộ output paste vào secret `EC2_SSH_KEY`.

### 8.2 — Cấp quyền cho EC2 pull từ GitHub

SSH vào EC2, tạo SSH key để GitHub xác thực:

```bash
ssh-keygen -t ed25519 -C "ec2-deploy" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Copy output → GitHub repo → **Settings** → **Deploy keys** → **Add deploy key** → paste vào, tick **Allow write access**.

### 8.3 — Clone bằng SSH thay vì HTTPS

Trên EC2, clone lại repo bằng SSH (nếu trước đó clone bằng HTTPS):

```bash
cd ~
rm -rf HienDashboard
git clone git@github.com:<user>/HienDashboard.git
cd HienDashboard
npm install
npm run build
pm2 start server.js --name hien-dashboard
pm2 startup && pm2 save
```

### 8.4 — Test CI/CD

Từ máy local, push một commit bất kỳ lên `main`:

```bash
git push origin main
```

Vào GitHub repo → tab **Actions** → xem workflow chạy. Nếu xanh là thành công.

---

## Lưu ý

| Vấn đề | Giải pháp |
|--------|-----------|
| Dữ liệu (`revenue.json`) lưu trong `data/` — không mất khi rebuild | Backup thư mục `data/` định kỳ |
| Free tier chỉ miễn phí 12 tháng | Theo dõi AWS Billing Dashboard |
| EC2 Public IP thay đổi mỗi lần restart | Gán **Elastic IP** (xem Phần 1) |
