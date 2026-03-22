import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, FileSpreadsheet } from 'lucide-react';
import { JobModal } from './components/JobModal';
import { JobTable } from './components/JobTable';
import { JobStats } from './components/JobStats';
import { ToastContainer, type ToastMessage } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { exportJobsToExcel } from './utils/exportExcel';
import type { AppDispatch, RootState } from './store/store';
import type { Job, JobStatus } from './types/job';
import { deleteJobAsync, fetchJobs, updateJobStatus } from './store/slices/jobSlice';

type StatusFilterTab = 'all' | 'Pending' | 'Accepted' | 'Rejected';

const STATUS_TABS: { key: StatusFilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'Pending', label: 'Đang chờ' },
  { key: 'Accepted', label: 'Đã nhận' },
  { key: 'Rejected', label: 'Từ chối' },
];

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, patchingJobId, deletingJobId } = useSelector(
    (state: RootState) => state.jobs
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [statusTab, setStatusTab] = useState<StatusFilterTab>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /**
   * Thêm một thông báo Toast mới vào danh sách.
   */
  const addToast = useCallback((message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  /**
   * Xóa thông báo Toast dựa trên ID.
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Lọc danh sách công việc dựa trên tên công ty và tab trạng thái đang chọn.
   * Sử dụng useMemo để tránh tính toán lại mỗi khi component re-render.
   */
  const filteredJobs = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    return items.filter((job) => {
      if (statusTab !== 'all' && job.status !== statusTab) return false;
      if (!q) return true;
      return job.companyName.toLowerCase().includes(q);
    });
  }, [items, companySearch, statusTab]);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  /**
   * Xử lý khi nhấn nút Sửa: Lưu công việc vào state và mở modal.
   * Sử dụng useCallback để giữ nguyên tham chiếu hàm giữa các lần render.
   */
  const handleEdit = useCallback((job: Job) => {
    setEditingJob(job);
    setShowAddModal(true);
  }, []);

  /**
   * Đóng modal và reset trạng thái chỉnh sửa.
   */
  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingJob(null);
  }, []);

  /**
   * Xử lý thay đổi trạng thái nhanh từ dropdown trong bảng.
   */
  const handleStatusChange = useCallback(
    (id: string, next: JobStatus) => {
      // Tìm trạng thái hiện tại để tránh dispatch action thừa
      const current = items.find((j) => j.id === id)?.status;
      if (current === next) return;
      
      void dispatch(updateJobStatus({ id, status: next }))
        .unwrap()
        .then(() => {
          addToast('Cập nhật trạng thái thành công!', 'success');
        })
        .catch(() => {
          addToast('Không cập nhật được trạng thái. Thử lại sau.', 'danger');
        });
    },
    [dispatch, items, addToast]
  );

  /**
   * Xử lý khi nhấn nút Xóa: Hiển thị confirm và gọi API xóa.
   */
  const handleDelete = useCallback(
    (job: Job) => {
      const label = job.companyName.trim() || `ID ${job.id}`;
      if (
        !window.confirm(
          `Xóa hẳn bản ghi ứng tuyển "${label}"?\nHành động này không hoàn tác.`
        )
      ) {
        return;
      }
      void dispatch(deleteJobAsync(job.id))
        .unwrap()
        .then(() => {
          addToast('Xóa bản ghi thành công!', 'success');
        })
        .catch(() => {
          addToast('Không xóa được bản ghi. Thử lại sau.', 'danger');
        });
    },
    [dispatch, addToast]
  );

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <h1 className="h3 mb-0">Danh sách Ứng tuyển</h1>
          <ThemeToggle />
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-success d-inline-flex align-items-center gap-2"
            onClick={() => exportJobsToExcel(items)}
            disabled={items.length === 0}
          >
            <FileSpreadsheet size={18} aria-hidden />
            Xuất Excel
          </button>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2"
            onClick={() => {
              setEditingJob(null);
              setShowAddModal(true);
            }}
            disabled={status !== 'succeeded'}
          >
            <Plus size={18} aria-hidden />
            Thêm ứng tuyển
          </button>
        </div>
      </div>

      <JobModal
        show={showAddModal}
        onHide={handleCloseModal}
        job={editingJob}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />

      {status === 'loading' && <div className="spinner-border text-primary" role="status" />}

      {status === 'failed' && <div className="alert alert-danger">Lỗi: {error}</div>}

      {status === 'succeeded' && (
        <>
          <JobStats jobs={items} />
          
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body py-3">
              <div className="row g-3 align-items-center">
                <div className="col-12 col-lg-5">
                  <label htmlFor="job-company-search" className="form-label small text-muted mb-1">
                    Tìm theo tên công ty
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white" aria-hidden="true">
                      <Search size={18} className="text-secondary" />
                    </span>
                    <input
                      id="job-company-search"
                      type="search"
                      className="form-control"
                      placeholder="Nhập tên công ty…"
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-12 col-lg-7">
                  <span className="form-label small text-muted mb-1 d-block">Lọc trạng thái</span>
                  <div className="d-flex flex-wrap gap-2" role="tablist" aria-label="Lọc theo trạng thái">
                    {STATUS_TABS.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={statusTab === key}
                        className={`btn btn-sm rounded-pill ${
                          statusTab === key ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setStatusTab(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {(companySearch.trim() || statusTab !== 'all') && (
                <p className="small text-muted mb-0 mt-3">
                  Hiển thị <strong>{filteredJobs.length}</strong> / {items.length} bản ghi
                </p>
              )}
            </div>
          </div>

          <JobTable
            jobs={filteredJobs}
            patchingJobId={patchingJobId}
            deletingJobId={deletingJobId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </>
      )}
    </div>
  );
}

export default App;