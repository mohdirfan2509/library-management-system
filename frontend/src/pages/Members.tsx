import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMembers, createMember } from '../api/membersApi';
import { Member } from '../types/member';
import { DataTable } from '../components/DataTable';

export const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const memberData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      membershipId: formData.get('membershipId') as string,
    };
    try {
      await createMember(memberData);
      fetchMembers();
      (e.target as HTMLFormElement).reset();
      alert('Member registered successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register member');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Members</h1>
      
      <DataTable<Member>
        data={members}
        loading={loading}
        rowKey={(member) => member.id}
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          { header: 'Membership ID', accessor: 'membershipId' },
          { 
            header: 'Action', 
            accessor: (member) => (
              <Link to={`/members/${member.id}/history`} className="text-indigo-600 hover:underline">View History</Link>
            )
          }
        ]}
      />

      <div className="mt-12 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Register Member</h2>
        <form onSubmit={handleAddMember} className="grid grid-cols-2 gap-4">
          <input required name="name" placeholder="Name" className="border p-2 rounded" />
          <input required name="email" type="email" placeholder="Email" className="border p-2 rounded" />
          <input required name="membershipId" placeholder="Membership ID" className="border p-2 rounded" />
          <div className="col-span-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Register Member</button>
          </div>
        </form>
      </div>
    </div>
  );
};
