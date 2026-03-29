import { ILoginRes, LoginFormValues } from 'types/user';
import axios from 'utils/axios';
import { USER_BASE_API_ENDPOINT } from 'utils/constants';

export const loginUser = async (data: LoginFormValues): Promise<ILoginRes> => {
  const res = await axios.post(`${USER_BASE_API_ENDPOINT}/login`, data);
  return res.data;
};

export const getUsers = async () => {
  const res = await axios.get(USER_BASE_API_ENDPOINT);
  return res.data;
};
