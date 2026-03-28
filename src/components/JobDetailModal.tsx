import { memo, useId } from 'react';
import {
  Building2,
  Briefcase,
  CalendarDays,
  Tag,
  DollarSign,
  Link as LinkIcon,
  StickyNote,
  Clock,
  Trash2,
  Pencil,
  AlertCircle,
} from 'lucide-react';
import type { Job, JobStatus } from '../types/job';

interface JobDetailModalProps {
  show: boolean;
  onHide: () => void;
  job: Job | null;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onSuccess?: (message: string) => void;
}

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

function formatDate(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('vi-VN');
}

export const JobDetailModal = memo(function JobDetailModal({
  show,
  onHide,
  job,
  onEdit,
  onDelete,
}: JobDetailModalProps) {
  const modalId = useId();

  if (!show || !job) return null;

  const isInterviewNear = job.interviewDate && new Date(job.interviewDate).getTime() >= new Date().setHours(0,0,0,0);
  const isExpired = job.expiryDate && new Date(job.expiryDate).getTime() < new Date().setHours(0,0,0,0);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${modalId}-title`}
        onClick={onHide}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-light border-0">
              <h2 id={`${modalId}-title`} className="modal-title h5 d-flex align-items-center gap-2">
                <Building2 className="text-primary" size={20} />
                Chi tiết ứng tuyển: {job.companyName}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                onClick={onHide}
              />
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-primary-subtle p-2 rounded">
                      <Briefcase className="text-primary" size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block uppercase small fw-bold">Vị trí</small>
                      <span className="fw-semibold">{job.position || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-warning-subtle p-2 rounded">
                      <Tag className="text-warning" size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block uppercase small fw-bold">Trạng thái</small>
                      <span className={`badge bg-${statusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-info-subtle p-2 rounded">
                      <CalendarDays className="text-info" size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block uppercase small fw-bold">Ngày ứng tuyển</small>
                      <span>{formatDate(job.appliedDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-success-subtle p-2 rounded">
                      <DollarSign className="text-success" size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block uppercase small fw-bold">Lương mong muốn</small>
                      <span>{job.salaryExpectation || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={`d-flex align-items-start gap-3 p-2 rounded ${isExpired ? 'bg-danger-subtle' : 'bg-light'}`}>
                    <div className="p-2 rounded bg-white shadow-sm">
                      <Clock className={isExpired ? 'text-danger' : 'text-secondary'} size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block uppercase small fw-bold">Hạn ứng tuyển</small>
                      <span className={isExpired ? 'text-danger fw-bold' : ''}>
                        {formatDate(job.expiryDate)}
                        {isExpired && <span className="ms-2 small">(Đã hết hạn)</span>}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={`d-flex align-items-start gap-3 p-2 rounded ${isInterviewNear ? 'bg-info-subtle border border-info' : 'bg-light'}`}>
                    <div className="p-2 rounded bg-white shadow-sm">
                      <AlertCircle className={isInterviewNear ? 'text-info' : 'text-secondary'} size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block uppercase small fw-bold">Lịch phỏng vấn</small>
                      <span className={isInterviewNear ? 'text-info fw-bold' : ''}>
                        {formatDate(job.interviewDate)}
                        {isInterviewNear && (
                          <div className="small text-info mt-1 animate-pulse">
                             Lịch phỏng vấn sắp tới!
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {job.linkJD && (
                  <div className="col-12">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-secondary-subtle p-2 rounded">
                        <LinkIcon className="text-secondary" size={20} />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <small className="text-muted d-block uppercase small fw-bold">Link JD</small>
                        <a href={job.linkJD} target="_blank" rel="noopener noreferrer" className="text-truncate d-block">
                          {job.linkJD}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light p-2 rounded">
                      <StickyNote className="text-secondary" size={20} />
                    </div>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block uppercase small fw-bold">Ghi chú</small>
                      <div className="p-3 bg-light rounded mt-1 border" style={{ whiteSpace: 'pre-wrap' }}>
                        {job.note || 'Không có ghi chú.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 bg-light">
              <button
                type="button"
                className="btn btn-outline-danger d-inline-flex align-items-center gap-2"
                onClick={() => {
                  onDelete(job);
                  onHide();
                }}
              >
                <Trash2 size={18} />
                Xóa
              </button>
              <div className="flex-grow-1" />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onHide}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={() => {
                  onEdit(job);
                  onHide();
                }}
              >
                <Pencil size={18} />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" aria-hidden="true" />
    </>
  );
});
