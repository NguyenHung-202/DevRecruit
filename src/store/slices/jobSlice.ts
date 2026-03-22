import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient, { JOBS_LIST_PATH } from '../../api/axiosClient';
import type { Job, JobStatus } from '../../types/job';

const JOB_STATUSES: JobStatus[] = ['Pending', 'Interviewing', 'Accepted', 'Rejected'];

/**
 * Kiểm tra xem một giá trị có phải là JobStatus hợp lệ không.
 */
function isJobStatus(v: unknown): v is JobStatus {
  return typeof v === 'string' && (JOB_STATUSES as string[]).includes(v);
}

/**
 * Chuẩn hóa dữ liệu từ API thành object Job để sử dụng trong ứng dụng.
 * Đảm bảo các trường không bị undefined và id luôn tồn tại.
 */
export function normalizeJobRow(row: unknown, index?: number): Job {
  const r = row as Record<string, unknown>;
  const id =
    r.id != null && String(r.id) !== ''
      ? String(r.id)
      : index !== undefined
        ? String(index)
        : '';
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
  };
}

/**
 * Chuẩn hóa danh sách công việc từ API.
 */
function normalizeJobs(raw: unknown): Job[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row, index) => normalizeJobRow(row, index));
}

export type NewJobPayload = Omit<Job, 'id'>;

/**
 * Thunk lấy danh sách toàn bộ công việc đã ứng tuyển.
 */
export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await axiosClient.get(JOBS_LIST_PATH);
    return normalizeJobs(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Request failed';
    return rejectWithValue(message);
  }
});

/**
 * Thunk thêm mới một bản ghi ứng tuyển.
 */
export const addJobAsync = createAsyncThunk(
  'jobs/add',
  async (payload: NewJobPayload, { rejectWithValue }) => {
    try {
      const data = await axiosClient.post(JOBS_LIST_PATH, payload);
      const fromApi = normalizeJobRow(data);
      // Fallback ID nếu API không trả về ID mới ngay lập tức
      return { ...payload, id: fromApi.id || `${Date.now()}` } satisfies Job;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể thêm bản ghi';
      return rejectWithValue(message);
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
      await axiosClient.patch(`${JOBS_LIST_PATH}/${id}`, { status });
      return { id, status };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không cập nhật được trạng thái';
      return rejectWithValue(message);
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
      const { id, ...payload } = job;
      await axiosClient.put(`${JOBS_LIST_PATH}/${id}`, payload);
      return job;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không cập nhật được bản ghi';
      return rejectWithValue(message);
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
      await axiosClient.delete(`${JOBS_LIST_PATH}/${id}`);
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không xóa được bản ghi';
      return rejectWithValue(message);
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
      });
  },
});

export default jobSlice.reducer;
