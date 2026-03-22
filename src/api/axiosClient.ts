import axios from 'axios';

export const MOCKAPI_BASE_URL = 'https://69bfe94a72ca04f3bcba0763.mockapi.io';
export const JOBS_LIST_PATH = '/jobs';

const axiosClient = axios.create({
  baseURL: MOCKAPI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosClient;
