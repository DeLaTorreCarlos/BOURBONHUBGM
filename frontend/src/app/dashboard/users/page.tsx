"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check permissions
    if (typeof window !== "undefined") {
      setCurrentUserRole(localStorage.getItem("userRole"));
    }

    // Fetch user list from backend
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          setUsers(users.filter(u => u.id !== id));
        }
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  if (currentUserRole !== "superadmin" && currentUserRole !== "admin") {
    return <div className="p-8 text-black">Access Denied. You do not have Master Override clearance.</div>;
  }

  return (
    <div className="p-8 text-black min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User & Access Management</h1>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm uppercase tracking-widest font-semibold transition-colors">
          + Add New User
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y border-b border-gray-200">
          <thead className="bg-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-600">ID</th>
              <th className="px-6 py-4 text-left font-medium text-gray-600">Email</th>
              <th className="px-6 py-4 text-left font-medium text-gray-600">Role</th>
              <th className="px-6 py-4 text-left font-medium text-gray-600">Status</th>
              <th className="px-6 py-4 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-orange-50/10 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'superadmin' ? 'bg-indigo-100 text-indigo-800' : user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* Superadmins can edit everyone. Admins can edit regular users but not superadmins. */}
                  {currentUserRole === 'superadmin' || user.role !== 'superadmin' ? (
                    <>
                      <button className="text-orange-600 hover:text-orange-900 mr-4 font-semibold uppercase tracking-wider text-xs">Edit</button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 font-semibold uppercase tracking-wider text-xs"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 italic text-xs">RESTRICTED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
