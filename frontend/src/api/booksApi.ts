import client from './client';
import { Book } from '../types/book';

export const getBooks = async (params?: { page?: number; limit?: number; title?: string; genre?: string }) => {
  const { data } = await client.get('/books', { params });
  return data;
};

export const createBook = async (bookData: Omit<Book, 'id'>) => {
  const { data } = await client.post('/books', bookData);
  return data;
};
