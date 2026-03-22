# DevRecruit - Quản lý Ứng tuyển Công việc 🚀

DevRecruit là một ứng dụng web hiện đại giúp các lập trình viên theo dõi và quản lý quá trình ứng tuyển công việc một cách hiệu quả. Với giao diện trực quan, tính năng Dark Mode và tối ưu hóa hiệu năng, ứng dụng mang lại trải nghiệm người dùng tuyệt vời trên cả máy tính và điện thoại.

---

## ✨ Các tính năng chính

- **Quản lý Ứng tuyển (CRUD)**: Thêm mới, chỉnh sửa và xóa thông tin các công ty bạn đã ứng tuyển.
- **Theo dõi Trạng thái**: Cập nhật nhanh trạng thái (Đang chờ, Phỏng vấn, Đã nhận, Từ chối) ngay trên bảng.
- **Tìm kiếm & Lọc**: Tìm nhanh theo tên công ty hoặc lọc danh sách theo trạng thái ứng tuyển.
- **Dark Mode**: Chế độ giao diện tối giúp bảo vệ mắt và tiết kiệm pin, tự động lưu lựa chọn người dùng.
- **Responsive Design**: Giao diện tự động chuyển sang dạng Card trên điện thoại, đảm bảo hiển thị thông tin rõ ràng nhất.
- **Thông báo Toast**: Phản hồi tức thì cho người dùng khi thực hiện các hành động (Thêm/Sửa/Xóa thành công).
- **Empty State**: Giao diện thân thiện khi chưa có dữ liệu, hướng dẫn người dùng bắt đầu.

---

## 🛠 Tech Stack

Ứng dụng được xây dựng với các công nghệ hiện đại nhất:

- **Frontend Framework**: [React 19](https://react.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) (Đảm bảo an toàn kiểu dữ liệu, không sử dụng `any`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) & CSS Variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 🚀 Hướng dẫn chạy ứng dụng

Để khởi chạy dự án trên máy tính cá nhân, hãy thực hiện theo các bước sau:

### 1. Cài đặt các phụ thuộc
Đảm bảo bạn đã cài đặt Node.js, sau đó chạy lệnh:
```bash
npm install
```

### 2. Khởi chạy ở chế độ Phát triển (Development)
Chạy lệnh sau để khởi động server cục bộ:
```bash
npm run dev
```
Sau đó, truy cập vào đường dẫn hiển thị trên terminal (thường là `http://localhost:5173`).

### 3. Xây dựng cho sản phẩm (Production)
Để tối ưu hóa và đóng gói ứng dụng:
```bash
npm run build
```

---

## 📈 Tối ưu hóa hiệu năng

Ứng dụng đã được tối ưu hóa để đạt điểm số cao trên Lighthouse:
- **React.memo**: Ngăn chặn re-render không cần thiết cho các component hiển thị.
- **useMemo & useCallback**: Tối ưu hóa logic tính toán và giữ nguyên tham chiếu hàm.
- **Tree-shaking**: Tối ưu hóa việc import icons để giảm kích thước bundle.
- **CSS Variables**: Chuyển đổi theme mượt mà không cần render lại toàn bộ DOM.

---

## 👨‍💻 Phát triển bởi

Dự án được thực hiện với tiêu chuẩn mã nguồn sạch, có chú thích đầy đủ bằng tiếng Việt để dễ dàng bảo trì và mở rộng.
