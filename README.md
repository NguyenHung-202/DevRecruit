# DevRecruit - Quản lý Ứng tuyển Công việc 🚀

**DevRecruit** là một ứng dụng Dashboard hiện đại giúp các lập trình viên theo dõi, quản lý và phân tích quá trình ứng tuyển công việc một cách khoa học. Ứng dụng không chỉ là nơi lưu trữ dữ liệu mà còn là một công cụ phân tích hiệu quả giúp bạn tối ưu hóa hành trình tìm việc.

🔗 **Live Demo**: [https://dev-recruit-gold.vercel.app/](https://dev-recruit-gold.vercel.app/)

---

## ✨ Các tính năng nổi bật

### 📊 1. Hệ thống Thống kê Thông minh (Analytics Dashboard)
- Tự động tổng hợp dữ liệu ngay khi có thay đổi (Thêm/Sửa/Xóa).
- Theo dõi các chỉ số quan trọng: Tổng số đơn, Đang chờ, Phỏng vấn, Đã nhận và Từ chối.
- **Tỉ lệ thành công (%)**: Chỉ số quan trọng nhất giúp đánh giá chất lượng CV và chiến thuật rải đơn.

### 📥 2. Xuất Báo cáo Excel chuyên nghiệp
- Trích xuất toàn bộ danh sách ứng tuyển ra file `.xlsx` chỉ với một cú click.
- Tự động chuẩn hóa dữ liệu sang Tiếng Việt, loại bỏ mã kỹ thuật và định dạng cột đẹp mắt.
- Tên file thông minh kèm theo ngày tháng xuất báo cáo (ví dụ: `Bao_cao_ung_tuyen_23_03_2026.xlsx`).

### 🌓 3. Chế độ Tối (Dark Mode) & Trải nghiệm người dùng
- Giao diện Dark Mode chuyên nghiệp, bảo vệ mắt và tiết kiệm pin.
- Tự động lưu lựa chọn theme vào `localStorage` và nhận diện cài đặt hệ thống.
- Hệ thống **Thông báo Toast** (Bootstrap) phản hồi tức thì cho mọi hành động.

### 📱 4. Giao diện Responsive (Mobile-first)
- Bảng dữ liệu tự động chuyển sang dạng **Card-view** trên điện thoại.
- Đảm bảo trải nghiệm mượt mà, dễ dàng thao tác trên mọi kích thước màn hình.

### 🛠 5. Chất lượng mã nguồn cao
- **100% TypeScript**: Kiểm soát kiểu dữ liệu chặt chẽ, không sử dụng `any`.
- **Clean Code**: Mã nguồn sạch sẽ, có chú thích Tiếng Việt chi tiết cho các hàm phức tạp.
- **Tối ưu hiệu năng**: Sử dụng `React.memo`, `useMemo`, `useCallback` để đạt tốc độ phản hồi nhanh nhất.

---

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) & CSS Variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Handling**: [Axios](https://axios-http.com/), [XLSX](https://sheetjs.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

---

## 🚀 Hướng dẫn khởi chạy

### 1. Cài đặt các thư viện
```bash
npm install
```

### 2. Chạy ở chế độ Phát triển (Development)
```bash
npm run dev
```
Mặc định ứng dụng sẽ chạy tại: `http://localhost:5173`

### 3. Đóng gói cho sản phẩm (Production)
```bash
npm run build
```

---

## 📈 Kết quả tối ưu hóa (Lighthouse)

Dự án được tối ưu hóa để đạt điểm số cao trên Chrome DevTools:
- **Performance**: Render mượt mà nhờ ngăn chặn re-render thừa.
- **Best Practices**: Cấu trúc thư mục chuẩn, sử dụng Tree-shaking cho Icons.
- **Accessibility**: Đầy đủ các thuộc tính ARIA và hỗ trợ bàn phím.

---

## 👨‍💻 Phát triển bởi

Dự án được xây dựng với tư duy hướng sản phẩm, sẵn sàng để tích hợp vào các hệ thống quản lý nhân sự hoặc dùng làm dự án tiêu biểu trong CV cá nhân.
