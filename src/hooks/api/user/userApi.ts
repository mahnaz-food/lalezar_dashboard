import { Paginated } from 'types/api';
import { GetUsersParams, LoginRes, LoginFormValues, User, CreateUserFormValues, UpdateUserFormValues } from 'types/user';
import axios from 'utils/axios';
import { USER_BASE_API_ENDPOINT } from 'utils/constants';

export const loginUser = async (data: LoginFormValues): Promise<LoginRes> => {
  const res = await axios.post(`${USER_BASE_API_ENDPOINT}/login`, data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(`${USER_BASE_API_ENDPOINT}/logout`);
  return res.data;
};

export const getUsers = async (params?: GetUsersParams): Promise<Paginated<User>> => {
  const res = await axios.get(USER_BASE_API_ENDPOINT, { params });
  return res.data;
};

export const getUser = async ({ id }: { id: string }): Promise<User> => {
  const res = await axios.get(`${USER_BASE_API_ENDPOINT}/${id}`);
  return res.data;
};

export const addUser = async (data: CreateUserFormValues) => {
  const res = await axios.post(USER_BASE_API_ENDPOINT, data);
  return res.data;
};

export const updateUser = async ({ id, data }: { id: string; data: UpdateUserFormValues }) => {
  const res = await axios.put(`${USER_BASE_API_ENDPOINT}/${id}`, data);
  return res.data;
};

export const deleteUser = async ({ id }: { id: string }) => {
  const res = await axios.delete(`${USER_BASE_API_ENDPOINT}/${id}`);
  return res.data;
};
