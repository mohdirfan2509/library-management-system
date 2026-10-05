import client from './client';
import { Member } from '../types/member';

export const getMembers = async () => {
  const { data } = await client.get('/members');
  return data;
};

export const createMember = async (memberData: Omit<Member, 'id' | 'joinedDate'>) => {
  const { data } = await client.post('/members', memberData);
  return data;
};

export const getMemberHistory = async (id: string) => {
  const { data } = await client.get(`/members/${id}/history`);
  return data;
};
