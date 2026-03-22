import * as XLSX from 'xlsx';
import type { Job } from '../types/job';

/**
 * Xuất danh sách công việc ra file Excel (.xlsx) chuyên nghiệp.
 * Tự động loại bỏ các trường kỹ thuật và định dạng lại tiêu đề cột.
 */
export const exportJobsToExcel = (jobs: Job[]) => {
  // 1. Chuẩn bị dữ liệu hiển thị (chỉ lấy các trường quan trọng với người dùng)
  const dataToExport = jobs.map((job, index) => ({
    'STT': index + 1,
    'Công ty': job.companyName,
    'Vị trí': job.position,
    'Ngày ứng tuyển': job.appliedDate,
    'Trạng thái': job.status,
    'Mức lương mong muốn': job.salaryExpectation || '—',
    'Link JD': job.linkJD || '—',
    'Ghi chú': job.note || '—',
  }));

  // 2. Tạo một Workbook mới
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách ứng tuyển');

  // 3. Thiết lập độ rộng cột tự động (cơ bản)
  const colWidths = [
    { wch: 5 },  // STT
    { wch: 25 }, // Công ty
    { wch: 20 }, // Vị trí
    { wch: 15 }, // Ngày ứng tuyển
    { wch: 15 }, // Trạng thái
    { wch: 20 }, // Mức lương
    { wch: 30 }, // Link JD
    { wch: 40 }, // Ghi chú
  ];
  worksheet['!cols'] = colWidths;

  // 4. Tạo tên file kèm ngày tháng hiện tại
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}`;
  const fileName = `Bao_cao_ung_tuyen_${dateStr}.xlsx`;

  // 5. Kích hoạt tải file
  XLSX.writeFile(workbook, fileName);
};
