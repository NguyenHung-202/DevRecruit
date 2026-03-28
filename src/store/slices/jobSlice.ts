import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient, { JOBS_LIST_PATH } from '../../api/axiosClient';
import type { Job, JobStatus } from '../../types/job';

const STORAGE_KEY = 'devrecruit_jobs_data';

const JOB_STATUSES: JobStatus[] = ['Pending', 'Interviewing', 'Accepted', 'Rejected'];

/**
 * Kiểm tra xem một giá trị có phải là JobStatus hợp lệ không.
 */
function isJobStatus(v: unknown): v is JobStatus {
  return typeof v === 'string' && (JOB_STATUSES as string[]).includes(v);
}

/**
 * Lấy dữ liệu từ LocalStorage.
 */
function getStoredJobs(): Job[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Lưu dữ liệu vào LocalStorage.
 */
function saveStoredJobs(jobs: Job[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

/**
 * Chuẩn hóa dữ liệu thành object Job để sử dụng trong ứng dụng.
 */
export function normalizeJobRow(row: unknown, index?: number): Job {
  const r = row as Record<string, unknown>;
  const id =
    r.id != null && String(r.id) !== ''
      ? String(r.id)
      : index !== undefined
        ? String(index)
        : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return {
    id,
    companyName: typeof r.companyName === 'string' ? r.companyName : '',
    position: typeof r.position === 'string' ? r.position : '',
    status: isJobStatus(r.status) ? r.status : 'Pending',
    appliedDate: typeof r.appliedDate === 'string' ? r.appliedDate : '',
    salaryExpectation:
      typeof r.salaryExpectation === 'string' ? r.salaryExpectation : undefined,
    note: typeof r.note === 'string' ? r.note : undefined,
    linkJD: typeof r.linkJD === 'string' ? r.linkJD : undefined,
    isFavorite: typeof r.isFavorite === 'boolean' ? r.isFavorite : false,
    expiryDate: typeof r.expiryDate === 'string' ? r.expiryDate : undefined,
    interviewDate: typeof r.interviewDate === 'string' ? r.interviewDate : undefined,
  };
}

export type NewJobPayload = Omit<Job, 'id'>;

/**
 * Thunk lấy danh sách toàn bộ công việc đã ứng tuyển.
 * Nếu LocalStorage trống, sẽ thử lấy từ API để đồng bộ lần đầu.
 */
export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // 1. Kiểm tra xem đã có dữ liệu trong LocalStorage chưa
    const localData = localStorage.getItem(STORAGE_KEY);
    
    if (localData !== null) {
      // Nếu đã có, dùng luôn dữ liệu local
      return JSON.parse(localData) as Job[];
    }
    
    // 2. Nếu chưa có (lần đầu chạy sau khi chuyển đổi), đồng bộ từ API
    try {
      const apiData = await axiosClient.get(JOBS_LIST_PATH);
      if (Array.isArray(apiData)) {
        const normalized = apiData.map((item, idx) => normalizeJobRow(item, idx));
        saveStoredJobs(normalized); // Lưu lại vào LocalStorage cho các lần sau
        return normalized;
      }
    } catch (apiError) {
      console.warn('Không thể đồng bộ ban đầu từ API, bắt đầu với danh sách trống.');
    }
    
    return [];
  } catch (error: unknown) {
    return rejectWithValue('Không thể tải dữ liệu');
  }
});

/**
 * Thunk thêm mới một bản ghi ứng tuyển.
 */
export const addJobAsync = createAsyncThunk(
  'jobs/add',
  async (payload: NewJobPayload, { rejectWithValue }) => {
    try {
      const jobs = getStoredJobs();
      const newJob = normalizeJobRow(payload);
      const updated = [newJob, ...jobs];
      saveStoredJobs(updated);
      return newJob;
    } catch (error: unknown) {
      return rejectWithValue('Không thể lưu bản ghi mới');
    }
  }
);

/**
 * Thunk cập nhật nhanh trạng thái của một ứng tuyển.
 */
export const updateJobStatus = createAsyncThunk(
  'jobs/patchStatus',
  async (
    { id, status }: { id: string; status: JobStatus },
    { rejectWithValue }
  ) => {
    try {
      const jobs = getStoredJobs();
      const idx = jobs.findIndex(j => j.id === id);
      if (idx !== -1) {
        jobs[idx].status = status;
        saveStoredJobs(jobs);
      }
      return { id, status };
    } catch (error: unknown) {
      return rejectWithValue('Không cập nhật được trạng thái');
    }
  }
);

/**
 * Thunk cập nhật toàn bộ thông tin của một ứng tuyển.
 */
export const updateJobAsync = createAsyncThunk(
  'jobs/update',
  async (job: Job, { rejectWithValue }) => {
    try {
      const jobs = getStoredJobs();
      const idx = jobs.findIndex(j => j.id === job.id);
      if (idx !== -1) {
        jobs[idx] = job;
        saveStoredJobs(jobs);
      }
      return job;
    } catch (error: unknown) {
      return rejectWithValue('Không cập nhật được bản ghi');
    }
  }
);

/**
 * Thunk xóa một bản ghi ứng tuyển.
 */
export const deleteJobAsync = createAsyncThunk(
  'jobs/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const jobs = getStoredJobs();
      const filtered = jobs.filter(j => j.id !== id);
      saveStoredJobs(filtered);
      return id;
    } catch (error: unknown) {
      return rejectWithValue('Không xóa được bản ghi');
    }
  }
);

/**
 * Thunk toggle trạng thái yêu thích.
 */
export const toggleFavoriteJob = createAsyncThunk(
  'jobs/toggleFavorite',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { jobs: JobState };
      const job = state.jobs.items.find((j) => j.id === id);
      if (!job) return rejectWithValue('Không tìm thấy công ty');

      const nextVal = !job.isFavorite;
      if (nextVal) {
        const favoriteCount = state.jobs.items.filter((j) => j.isFavorite).length;
        if (favoriteCount >= 3) {
          return rejectWithValue('Chỉ được đánh dấu tối đa 3 công ty yêu thích');
        }
      }

      const jobs = getStoredJobs();
      const idx = jobs.findIndex(j => j.id === id);
      if (idx !== -1) {
        jobs[idx].isFavorite = nextVal;
        saveStoredJobs(jobs);
      }
      return { id, isFavorite: nextVal };
    } catch (error: unknown) {
      return rejectWithValue('Không thể cập nhật trạng thái yêu thích');
    }
  }
);

interface JobState {
  items: Job[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  addSubmitting: boolean;
  patchingJobId: string | null;
  deletingJobId: string | null;
}

const initialState: JobState = {
  items: [],
  status: 'idle',
  error: null,
  addSubmitting: false,
  patchingJobId: null,
  deletingJobId: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addJobAsync.pending, (state) => {
        state.addSubmitting = true;
      })
      .addCase(addJobAsync.fulfilled, (state, action) => {
        state.addSubmitting = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(addJobAsync.rejected, (state) => {
        state.addSubmitting = false;
      })
      .addCase(updateJobStatus.pending, (state, action) => {
        state.patchingJobId = action.meta.arg.id;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.patchingJobId = null;
        const { id, status } = action.payload;
        const idx = state.items.findIndex((j) => j.id === id);
        if (idx !== -1) state.items[idx].status = status;
      })
      .addCase(updateJobStatus.rejected, (state) => {
        state.patchingJobId = null;
      })
      .addCase(updateJobAsync.pending, (state) => {
        state.addSubmitting = true;
      })
      .addCase(updateJobAsync.fulfilled, (state, action) => {
        state.addSubmitting = false;
        const idx = state.items.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(updateJobAsync.rejected, (state) => {
        state.addSubmitting = false;
      })
      .addCase(deleteJobAsync.pending, (state, action) => {
        state.deletingJobId = action.meta.arg;
      })
      .addCase(deleteJobAsync.fulfilled, (state, action) => {
        state.deletingJobId = null;
        state.items = state.items.filter((j) => j.id !== action.payload);
      })
      .addCase(deleteJobAsync.rejected, (state) => {
        state.deletingJobId = null;
      })
      .addCase(toggleFavoriteJob.fulfilled, (state, action) => {
        const { id, isFavorite } = action.payload;
        const idx = state.items.findIndex((j) => j.id === id);
        if (idx !== -1) {
          state.items[idx].isFavorite = isFavorite;
        }
      });
  },
});

export default jobSlice.reducer;
