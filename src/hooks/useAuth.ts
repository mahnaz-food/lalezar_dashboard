import { useQuery } from '@tanstack/react-query';
import axios from 'utils/axios';
import { USER_BASE_API_ENDPOINT } from 'utils/constants';

// ==============================|| HOOKS - AUTH ||============================== //

export default function useAuth({ enabled = true } = {}) {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axios.get(`${USER_BASE_API_ENDPOINT}/profile`, { skipErrorToast: true });
      return res.data;
    },
    retry: false,
    enabled
  });
}
