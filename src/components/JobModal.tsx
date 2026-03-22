import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  memo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil } from 'lucide-react';
import type { AppDispatch, RootState } from '../store/store';
import type { Job, JobStatus } from '../types/job';
import { addJobAsync, updateJobAsync, type NewJobPayload } from '../store/slices/jobSlice';

const STATUSES: JobStatus[] = ['Pending', 'Interviewing', 'Accepted', 'Rejected'];

const emptyForm = (): NewJobPayload => ({
  companyName: '',
  position: '',
  status: 'Pending',
  appliedDate: new Date().toISOString().slice(0, 10),
  salaryExpectation: '',
  note: '',
  linkJD: '',
});

export interface JobModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: (message: string) => void;
  job?: Job | null;
}

/**
 * Modal dùng để thêm mới hoặc chỉnh sửa thông tin ứng tuyển.
 * Sử dụng React.memo để tối ưu hiệu năng render.
 */
export const JobModal = memo(function JobModal({ show, onHide, onSuccess, job }: JobModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const addSubmitting = useSelector((s: RootState) => s.jobs.addSubmitting);
  const formId = useId();

  const [form, setForm] = useState<NewJobPayload>(emptyForm);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * Khởi tạo hoặc đặt lại giá trị cho form.
   * Nếu có prop `job`, điền thông tin của công việc đó để sửa.
   * Nếu không, điền giá trị mặc định để thêm mới.
   */
  const reset = useCallback(() => {
    if (job) {
      setForm({
        companyName: job.companyName,
        position: job.position,
        status: job.status,
        appliedDate: job.appliedDate,
        salaryExpectation: job.salaryExpectation || '',
        note: job.note || '',
        linkJD: job.linkJD || '',
      });
    } else {
      setForm(emptyForm());
    }
    setCompanyError(null);
    setApiError(null);
  }, [job]);

  useEffect(() => {
    if (show) reset();
  }, [show, reset]);

  /**
   * Cập nhật giá trị của một trường trong form khi người dùng nhập liệu.
   */
  const update =
    <K extends keyof NewJobPayload>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setForm((prev) => ({ ...prev, [key]: v }));
      if (key === 'companyName' && companyError) setCompanyError(null);
    };

  /**
   * Xử lý gửi form (Thêm mới hoặc Cập nhật).
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const name = form.companyName.trim();
    if (!name) {
      setCompanyError('Vui lòng nhập tên công ty.');
      return;
    }
    setCompanyError(null);

    const payload: NewJobPayload = {
      ...form,
      companyName: name,
      position: form.position.trim(),
      appliedDate: form.appliedDate.trim(),
      salaryExpectation: form.salaryExpectation?.trim() || undefined,
      note: form.note?.trim() || undefined,
      linkJD: form.linkJD?.trim() || undefined,
    };

    try {
      if (job) {
        // Nếu đang ở chế độ sửa
        await dispatch(updateJobAsync({ ...payload, id: job.id })).unwrap();
        onSuccess?.('Cập nhật thông tin thành công!');
      } else {
        // Nếu đang ở chế độ thêm mới
        await dispatch(addJobAsync(payload)).unwrap();
        onSuccess?.('Thêm ứng tuyển mới thành công!');
      }
      onHide();
    } catch (err) {
      setApiError(typeof err === 'string' ? err : 'Có lỗi xảy ra khi gửi dữ liệu.');
    }
  };

  const handleClose = () => {
    if (!addSubmitting) onHide();
  };

  if (!show) return null;

  const isEdit = !!job;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        onClick={handleClose}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <h2 id={`${formId}-title`} className="modal-title h5 d-flex align-items-center gap-2">
                {isEdit ? (
                  <Pencil className="text-primary" size={22} aria-hidden />
                ) : (
                  <Plus className="text-primary" size={22} aria-hidden />
                )}
                {isEdit ? 'Chỉnh sửa ứng tuyển' : 'Thêm ứng tuyển mới'}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                onClick={handleClose}
                disabled={addSubmitting}
              />
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                {apiError && <div className="alert alert-danger py-2">{apiError}</div>}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor={`${formId}-company`} className="form-label">
                      Công ty <span className="text-danger">*</span>
                    </label>
                    <input
                      id={`${formId}-company`}
                      type="text"
                      className={`form-control ${companyError ? 'is-invalid' : ''}`}
                      value={form.companyName}
                      onChange={update('companyName')}
                      autoComplete="organization"
                      disabled={addSubmitting}
                    />
                    {companyError && <div className="invalid-feedback">{companyError}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`${formId}-position`} className="form-label">
                      Vị trí
                    </label>
                    <input
                      id={`${formId}-position`}
                      type="text"
                      className="form-control"
                      value={form.position}
                      onChange={update('position')}
                      disabled={addSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`${formId}-date`} className="form-label">
                      Ngày ứng tuyển
                    </label>
                    <input
                      id={`${formId}-date`}
                      type="date"
                      className="form-control"
                      value={form.appliedDate}
                      onChange={update('appliedDate')}
                      disabled={addSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`${formId}-status`} className="form-label">
                      Trạng thái
                    </label>
                    <select
                      id={`${formId}-status`}
                      className="form-select"
                      value={form.status}
                      onChange={update('status')}
                      disabled={addSubmitting}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`${formId}-salary`} className="form-label">
                      Mức lương mong muốn
                    </label>
                    <input
                      id={`${formId}-salary`}
                      type="text"
                      className="form-control"
                      value={form.salaryExpectation ?? ''}
                      onChange={update('salaryExpectation')}
                      disabled={addSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`${formId}-link`} className="form-label">
                      Link JD
                    </label>
                    <input
                      id={`${formId}-link`}
                      type="url"
                      className="form-control"
                      value={form.linkJD ?? ''}
                      onChange={update('linkJD')}
                      disabled={addSubmitting}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor={`${formId}-note`} className="form-label">
                      Ghi chú
                    </label>
                    <textarea
                      id={`${formId}-note`}
                      className="form-control"
                      rows={2}
                      value={form.note ?? ''}
                      onChange={update('note')}
                      disabled={addSubmitting}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClose}
                  disabled={addSubmitting}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={addSubmitting}>
                  {addSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Đang lưu…
                    </>
                  ) : (
                    'Lưu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" aria-hidden="true" />
    </>
  );
});
