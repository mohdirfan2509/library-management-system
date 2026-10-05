import client from './client';
import { AuthResponse } from '../types/auth';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await client.post('/auth/login', { email, password });
  return data;
};
