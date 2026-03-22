import axios, { AxiosError } from 'axios';
import { API_URL } from './constants';
import { toast } from 'sonner';

function handleError(error: unknown) {
  let message = 'Something went wrong';

  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string };
    message = data?.message || message;
  }

  toast.error(message);
}

const axiosServices = axios.create({ baseURL: API_URL, withCredentials: true });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (res) => res,
  (error) => {
    handleError(error);
    return Promise.reject(error);
  }
);

export default axiosServices;
