import { useEffect, useState, memo } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'danger' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

/**
 * Component chứa danh sách các thông báo Toast.
 * Được định vị cố định ở góc dưới bên phải màn hình.
 */
export function ToastContainer({ toasts, onClose }: ToastProps) {
  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
}

/**
 * Một mục thông báo Toast đơn lẻ.
 * Có hiệu ứng fade-in khi xuất hiện và tự động biến mất sau 3 giây.
 * Sử dụng React.memo để tối ưu hiệu năng.
 */
const ToastItem = memo(function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay nhỏ để kích hoạt hiệu ứng CSS transition
    const timer = setTimeout(() => setShow(true), 10);
    
    // Tự động đóng sau 3 giây
    const autoCloseTimer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // Đợi hiệu ứng fade-out hoàn tất rồi mới xóa khỏi DOM
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [onClose]);

  /**
   * Lấy icon Lucide phù hợp với loại thông báo.
   */
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={18} className="text-success" />;
      case 'danger':
        return <XCircle size={18} className="text-danger" />;
      case 'info':
        return <Info size={18} className="text-info" />;
    }
  };

  return (
    <div
      className={`toast fade ${show ? 'show' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header border-0 pb-1">
        <span className="me-2">{getIcon()}</span>
        <strong className="me-auto text-capitalize">{toast.type}</strong>
        <button
          type="button"
          className="btn-close ms-2"
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          aria-label="Close"
        />
      </div>
      <div className="toast-body pt-0 pb-2">
        {toast.message}
      </div>
    </div>
  );
});
