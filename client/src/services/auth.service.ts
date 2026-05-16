import api from './api';
import type { AuthResponse, LoginInput, RegisterInput } from '../types';

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<any>('/auth/login', data);
  const { token, ...user } = response.data.data;
  return { success: response.data.success, token, user: user as any };
};

export const registerUser = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post<any>('/auth/register', data);
  const { token, ...user } = response.data.data;
  return { success: response.data.success, token, user: user as any };
};
