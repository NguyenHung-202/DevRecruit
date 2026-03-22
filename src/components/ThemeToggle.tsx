import { useEffect, useState, memo } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Component nút chuyển đổi chế độ Sáng/Tối.
 * Lưu lựa chọn vào localStorage và áp dụng attribute `data-theme` for html.
 * Sử dụng React.memo để tránh render lại không cần thiết.
 */
export const ThemeToggle = memo(function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Ưu tiên lựa chọn đã lưu trong localStorage, nếu không có thì kiểm tra setting hệ thống
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      type="button"
      className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
      style={{ width: '40px', height: '40px' }}
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
});
