# OnTap GPLX - Ôn Thi Giấy Phép Lái Xe 2026

Ứng dụng web hiện đại hỗ trợ học viên ôn luyện sát hạch cấp Giấy phép lái xe (GPLX) cơ giới đường bộ theo chuẩn tài liệu mới nhất của Cục Đường bộ Việt Nam.

![OnTap GPLX Banner](/web/public/logo.jpg)

## 🚀 Tính năng nổi bật

- **Toàn bộ 600 câu hỏi lý thuyết:** Phân hạng chi tiết theo từng loại bằng (A1, A, B, C1, C, D1, D2, D, BE, CE...).
- **60 câu hỏi điểm liệt:** Đánh dấu cảnh báo tình huống mất an toàn giao thông nghiêm trọng.
- **120 tình huống mô phỏng:** Trắc nghiệm 4 phần theo quy chế sát hạch mới.
- **Thi thử sát hạch chuẩn:** Tạo đề ngẫu nhiên theo đúng thời gian và cấu trúc đề thi chính thức do Sở GTVT tổ chức.
- **Theo dõi tiến độ & Mẹo nhớ nhanh:** Thống kê tỷ lệ thi đỗ, danh sách câu hay làm sai, giải thích chi tiết cho từng câu hỏi.
- **Progressive Web App (PWA):** Cài đặt trực tiếp vào màn hình chính trên iPhone (iOS), Android và máy tính (Windows/macOS), mở nhanh không cần thanh địa chỉ trình duyệt.
- **Tối ưu hiển thị đa thiết bị:** Hỗ trợ đầy đủ Safe Zone (Tai thỏ, Dynamic Island, thanh cử chỉ Android/iOS) và chế độ xoay ngang (Landscape).

## 🛠️ Công nghệ sử dụng

- **Frontend:** React 19, TypeScript
- **Styling:** TailwindCSS v4, Lucide Icons
- **Bundler:** Vite
- **PWA:** Service Worker (Offline Cache), Web App Manifest

## 💻 Cài đặt và phát triển cục bộ

```bash
# Clone dự án
git clone https://github.com/trevorthanhtung/OnTapGPLX.git
cd OnTapGPLX

# Cài đặt dependencies
cd web
npm install

# Khởi chạy môi trường phát triển
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`.

---
Thực hiện bởi [thanhtungg.](https://www.youtube.com/@kat.thanhtungg)
