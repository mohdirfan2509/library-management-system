import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMemberHistory } from '../api/membersApi';
import { returnBook } from '../api/borrowApi';
import { BorrowRecord } from '../types/borrow';
import { Member } from '../types/member';

export const MemberHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!id) return;
    try {
      const res = await getMemberHistory(id);
      setMember(res.data.member);
      setHistory(res.data.history);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]);

  const handleReturn = async (borrowId: string) => {
    try {
      await returnBook(borrowId);
      alert('Book returned successfully');
      fetchHistory();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to return book');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">History for {member?.name}</h1>
      <p className="text-gray-600 mb-6">Membership ID: {member?.membershipId}</p>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Book</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Issue Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map(record => (
              <tr key={record.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{record.book?.title || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(record.issueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">
                  {record.status === 'overdue' && <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Overdue</span>}
                  {record.status === 'issued' && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Issued</span>}
                  {record.status === 'returned' && <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Returned</span>}
                </td>
                <td className="px-6 py-4 text-sm">
                  {record.status !== 'returned' && (
                    <button onClick={() => handleReturn(record.id)} className="text-indigo-600 hover:underline font-semibold">
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No borrowing history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
