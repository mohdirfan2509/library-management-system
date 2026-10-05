import React from 'react';

export const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500">Welcome to ShelfLife System!</div>
          <div className="text-sm mt-2 text-gray-400">Navigate using the sidebar to manage books, members, and borrow records.</div>
        </div>
      </div>
    </div>
  );
};
