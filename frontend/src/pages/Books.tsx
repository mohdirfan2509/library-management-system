import React, { useEffect, useState } from 'react';
import { getBooks, createBook } from '../api/booksApi';
import { Book } from '../types/book';
import { DataTable } from '../components/DataTable';

export const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [titleSearch, setTitleSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks({ page, limit: 10, title: titleSearch, genre: genreFilter });
      setBooks(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, titleSearch, genreFilter]);

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const total = Number(formData.get('totalCopies'));
    const bookData = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      ISBN: formData.get('ISBN') as string,
      genre: formData.get('genre') as string,
      totalCopies: total,
      availableCopies: total
    };
    try {
      await createBook(bookData);
      fetchBooks();
      (e.target as HTMLFormElement).reset();
      alert('Book added successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      
      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Search title..." className="border p-2 rounded" value={titleSearch} onChange={e => { setTitleSearch(e.target.value); setPage(1); }} />
        <input type="text" placeholder="Filter genre..." className="border p-2 rounded" value={genreFilter} onChange={e => { setGenreFilter(e.target.value); setPage(1); }} />
      </div>

      <DataTable<Book>
        data={books}
        loading={loading}
        rowKey={(book) => book.id}
        columns={[
          { header: 'Title', accessor: 'title' },
          { header: 'Author', accessor: 'author' },
          { header: 'ISBN', accessor: 'ISBN' },
          { header: 'Genre', accessor: 'genre' },
          { header: 'Total', accessor: 'totalCopies' },
          { header: 'Available', accessor: 'availableCopies' }
        ]}
      />

      <div className="mt-4 flex gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span className="px-3 py-1">Page {page} of {totalPages || 1}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      <div className="mt-12 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="grid grid-cols-2 gap-4">
          <input required name="title" placeholder="Title" className="border p-2 rounded" />
          <input required name="author" placeholder="Author" className="border p-2 rounded" />
          <input required name="ISBN" placeholder="ISBN" className="border p-2 rounded" />
          <input required name="genre" placeholder="Genre" className="border p-2 rounded" />
          <input required name="totalCopies" type="number" min="0" placeholder="Total Copies" className="border p-2 rounded" />
          <div className="col-span-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Add Book</button>
          </div>
        </form>
      </div>
    </div>
  );
};
