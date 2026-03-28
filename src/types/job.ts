export type JobStatus = 'Pending' | 'Interviewing' | 'Accepted' | 'Rejected';

export interface Job {
  id: string;
  companyName: string;
  position: string;
  status: JobStatus;
  appliedDate: string;
  salaryExpectation?: string;
  note?: string;
  linkJD?: string;
  isFavorite?: boolean;
  expiryDate?: string;
  interviewDate?: string;
}
