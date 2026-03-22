import { memo } from 'react';
import {
  Briefcase,
  Building2,
  CalendarDays,
  Pencil,
  Tag,
  Trash2,
  ClipboardList,
} from 'lucide-react';
import type { Job, JobStatus } from '../types/job';

/**
 * Trả về class Bootstrap tương ứng với trạng thái của công việc.
 */
function statusBadgeClass(status: JobStatus): string {
  switch (status) {
    case 'Accepted':
      return 'success';
    case 'Rejected':
      return 'danger';
    case 'Interviewing':
      return 'info';
    case 'Pending':
    default:
      return 'warning';
  }
}

/**
 * Định dạng ngày tháng sang kiểu Việt Nam (DD/MM/YYYY).
 */
function formatAppliedDate(value: string): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('vi-VN');
}

const STATUS_OPTIONS: JobStatus[] = ['Pending', 'Interviewing', 'Accepted', 'Rejected'];

export interface JobTableProps {
  jobs: Job[];
  patchingJobId?: string | null;
  deletingJobId?: string | null;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  onStatusChange?: (id: string, status: JobStatus) => void;
}

const iconCellClass = 'text-body-secondary me-2';
const headerIconClass = 'text-primary me-2';

/**
 * Component bảng hiển thị danh sách công việc.
 * Được bọc trong React.memo để tránh re-render khi props không đổi.
 */
export const JobTable = memo(function JobTable({
  jobs,
  patchingJobId,
  deletingJobId,
  onEdit,
  onDelete,
  onStatusChange,
}: JobTableProps) {
  return (
    <div className="table-responsive shadow-sm rounded border">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">
              <Building2 size={16} className={headerIconClass} aria-hidden />
              Công ty
            </th>
            <th scope="col">
              <Briefcase size={16} className={headerIconClass} aria-hidden />
              Vị trí
            </th>
            <th scope="col">
              <CalendarDays size={16} className={headerIconClass} aria-hidden />
              Ngày ứng tuyển
            </th>
            <th scope="col">
              <Tag size={16} className={headerIconClass} aria-hidden />
              Trạng thái
            </th>
            <th scope="col" className="text-end" style={{ width: '1%' }}>
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-5">
                <div className="text-center text-muted">
                  <div className="mb-3 d-inline-block p-4 rounded-circle bg-light">
                    <ClipboardList size={48} className="text-secondary opacity-50" />
                  </div>
                  <h3 className="h5 fw-semibold mb-2">Chưa có bản ghi nào</h3>
                  <p className="mb-0 mx-auto" style={{ maxWidth: '20rem' }}>
                    Có vẻ như bạn chưa thêm ứng tuyển nào. Hãy nhấn nút "Thêm ứng tuyển" để bắt đầu theo dõi hành trình tìm việc của mình!
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.id}>
                <td data-label="Công ty">
                  <Building2 size={16} className={iconCellClass} aria-hidden />
                  {job.companyName}
                </td>
                <td data-label="Vị trí">
                  <Briefcase size={16} className={iconCellClass} aria-hidden />
                  {job.position}
                </td>
                <td data-label="Ngày ứng tuyển">
                  <CalendarDays size={16} className={iconCellClass} aria-hidden />
                  {formatAppliedDate(job.appliedDate)}
                </td>
                <td data-label="Trạng thái" style={{ minWidth: '11rem' }}>
                  {onStatusChange ? (
                    <select
                      className="form-select form-select-sm"
                      value={job.status}
                      disabled={patchingJobId === job.id}
                      aria-label={`Trạng thái ${job.companyName || job.id}`}
                      onChange={(e) =>
                        onStatusChange(job.id, e.target.value as JobStatus)
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`badge bg-${statusBadgeClass(job.status)}`}>
                      {job.status}
                    </span>
                  )}
                </td>
                <td className="text-end text-nowrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => onEdit?.(job)}
                    aria-label={`Sửa ${job.companyName}`}
                  >
                    <Pencil size={16} className="me-1" aria-hidden />
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete?.(job)}
                    disabled={deletingJobId === job.id}
                    aria-label={`Xóa ${job.companyName}`}
                  >
                    <Trash2 size={16} className="me-1" aria-hidden />
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
