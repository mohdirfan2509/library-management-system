import React, { useState, useEffect } from 'react';
import { getBooks } from '../api/booksApi';
import { getMembers } from '../api/membersApi';
import { issueBook } from '../api/borrowApi';
import { Book } from '../types/book';
import { Member } from '../types/member';

export const IssueBook = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBooks({ limit: 1000 }).then(res => setBooks(res.data));
    getMembers().then(res => setMembers(res.data));
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) return;
    setLoading(true);
    try {
      await issueBook(selectedBook, selectedMember);
      alert('Book issued successfully!');
      setSelectedBook('');
      setSelectedMember('');
      // refresh books
      const res = await getBooks({ limit: 1000 });
      setBooks(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Issue Book</h1>
      <form onSubmit={handleIssue} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Member</label>
          <select required className="w-full border p-2 rounded" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
            <option value="">-- Select Member --</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.membershipId})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Select Book</label>
          <select required className="w-full border p-2 rounded" value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
            <option value="">-- Select Book --</option>
            {books.map(b => (
              <option key={b.id} value={b.id} disabled={b.availableCopies === 0}>
                {b.title} - {b.availableCopies} available
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Issuing...' : 'Issue Book'}
        </button>
      </form>
    </div>
  );
};
