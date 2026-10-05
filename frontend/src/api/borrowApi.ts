import client from './client';

export const issueBook = async (bookId: string, memberId: string) => {
  const { data } = await client.post('/borrow', { bookId, memberId });
  return data;
};

export const returnBook = async (borrowId: string) => {
  const { data } = await client.post(`/return/${borrowId}`);
  return data;
};
