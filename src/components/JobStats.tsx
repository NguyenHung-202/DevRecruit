import { memo } from 'react';
import { 
  ClipboardList, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  TrendingUp 
} from 'lucide-react';
import type { Job } from '../types/job';

interface JobStatsProps {
  jobs: Job[];
}

/**
 * Component hiển thị các thẻ thống kê tổng quan về quá trình ứng tuyển.
 * Tính toán tự động dựa trên danh sách công việc hiện có.
 */
export const JobStats = memo(function JobStats({ jobs }: JobStatsProps) {
  const total = jobs.length;
  const pending = jobs.filter(j => j.status === 'Pending').length;
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
  const accepted = jobs.filter(j => j.status === 'Accepted').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  // Tính tỷ lệ thành công (số đơn được chấp nhận / tổng số đơn)
  const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  const stats = [
    {
      label: 'Tổng số đơn',
      value: total,
      icon: <ClipboardList className="text-primary" size={24} />,
      color: 'primary',
      description: 'Đã rải CV'
    },
    {
      label: 'Đang chờ',
      value: pending,
      icon: <Clock className="text-warning" size={24} />,
      color: 'warning',
      description: 'Chưa phản hồi'
    },
    {
      label: 'Phỏng vấn',
      value: interviewing,
      icon: <MessageSquare className="text-info" size={24} />,
      color: 'info',
      description: 'Đang trao đổi'
    },
    {
      label: 'Đã nhận',
      value: accepted,
      icon: <CheckCircle2 className="text-success" size={24} />,
      color: 'success',
      description: 'Chúc mừng bạn!'
    },
    {
      label: 'Từ chối',
      value: rejected,
      icon: <XCircle className="text-danger" size={24} />,
      color: 'danger',
      description: 'Cố gắng thêm nhé'
    },
    {
      label: 'Tỉ lệ thành công',
      value: `${successRate}%`,
      icon: <TrendingUp className="text-purple" size={24} />,
      color: 'purple',
      description: 'Đo lường hiệu quả'
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="col-6 col-md-4 col-xl-2">
          <div className="card h-100 border-0 shadow-sm overflow-hidden">
            <div className={`card-body p-3 border-start border-4 border-${stat.color}`}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="p-2 rounded-bg-light">
                  {stat.icon}
                </div>
                <span className={`badge bg-${stat.color} bg-opacity-10 text-${stat.color} rounded-pill`}>
                  {stat.label}
                </span>
              </div>
              <h4 className="fw-bold mb-1">{stat.value}</h4>
              <p className="small text-muted mb-0">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
