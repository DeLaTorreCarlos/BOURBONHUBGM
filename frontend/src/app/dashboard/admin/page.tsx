"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Link from "next/link";
import UserDropdown from "@/components/dashboard/UserDropdown";

type User = {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
};

function AdminContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  // Add User State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ full_name: '', email: '', password: '', role: 'user', is_active: true });

  // Edit User State
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUserForm, setEditUserForm] = useState({ full_name: '', email: '', password: '', role: 'user', is_active: true });

  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "users";

  useEffect(() => {
    // Check permissions
    if (typeof window !== "undefined") {
      setCurrentUserRole(localStorage.getItem("userRole"));
    }

    // Fetch user list from backend logic only if on users tab
    if (activeTab === "users") {
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
    }
  }, [activeTab]);

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: newUserForm.full_name,
          email: newUserForm.email,
          password: newUserForm.password,
          role: newUserForm.role,
          is_active: newUserForm.is_active
        })
      });
      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setIsAddingUser(false);
        setNewUserForm({ full_name: '', email: '', password: '', role: 'user', is_active: true });
      } else {
        const errData = await response.json();
        alert(`Failed to create user: ${errData.detail}`);
      }
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  const startEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditUserForm({
      full_name: user.full_name || '',
      email: user.email,
      password: '', // Optional for updating
      role: user.role,
      is_active: user.is_active
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    try {
      const payload: any = {
        full_name: editUserForm.full_name,
        email: editUserForm.email,
        role: editUserForm.role,
        is_active: editUserForm.is_active
      };
      // Only include password if the user entered one
      if (editUserForm.password) {
        payload.password = editUserForm.password;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === editingUserId ? updatedUser : u));
        setEditingUserId(null);
      } else {
        const errData = await response.json();
        alert(`Failed to update user: ${errData.detail}`);
      }
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  if (currentUserRole !== "superadmin" && currentUserRole !== "admin") {
    return <div className="min-h-screen bg-black p-8 text-white">Access Denied. You do not have clearance.</div>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col p-8 text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <span className="text-3xl font-serif tracking-widest">BOURBON</span>
          <span className="text-3xl font-bold tracking-wide">HUB</span>
        </Link>
        <UserDropdown />
      </div>

      <div className="text-2xl mb-8 tracking-wide uppercase">
        {currentUserRole === 'superadmin' ? 'Master Override' : 'Administration'}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-8 border-b border-white/30 mb-8 max-w-6xl">
        <button
          onClick={() => router.push('/dashboard/admin?tab=users')}
          className={`pb-2 tracking-widest text-sm uppercase ${
            activeTab === 'users'
              ? 'border-b-2 border-white font-bold'
              : 'text-gray-400 hover:text-white transition-colors'
          }`}
        >
          Users Configuration
        </button>
        <button
          onClick={() => router.push('/dashboard/admin?tab=system')}
          className={`pb-2 tracking-widest text-sm uppercase ${
            activeTab === 'system'
              ? 'border-b-2 border-white font-bold'
              : 'text-gray-400 hover:text-white transition-colors'
          }`}
        >
          System Analytics
        </button>
        <button
          onClick={() => router.push('/dashboard/admin?tab=logs')}
          className={`pb-2 tracking-widest text-sm uppercase ${
            activeTab === 'logs'
              ? 'border-b-2 border-white font-bold'
              : 'text-gray-400 hover:text-white transition-colors'
          }`}
        >
          System Logs
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full flex-grow max-w-6xl">
        {activeTab === 'users' && (
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-md font-bold tracking-wide uppercase">Manage Accounts</h2>
              <button 
                onClick={() => setIsAddingUser(true)}
                className="border border-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors w-fit text-sm tracking-widest uppercase">
                + Add New User
              </button>
            </div>

            <div className="bg-transparent border border-white/50 w-full overflow-hidden">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-[#111] uppercase tracking-widest text-[10px] text-gray-400">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">ID</th>
                    <th className="px-6 py-4 text-left font-bold">Username</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-left font-bold">Role</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap text-gray-400 font-mono text-sm">{user.id}</td>
                      <td className="px-6 py-5 whitespace-nowrap font-medium text-white text-sm">{user.full_name || 'N/A'}</td>
                      <td className="px-6 py-5 whitespace-nowrap font-medium text-white text-sm">{user.email}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-[10px] tracking-widest uppercase font-bold border ${user.role === 'superadmin' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-white/50'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-[10px] tracking-widest uppercase font-bold border ${user.is_active ? 'bg-transparent text-green-400 border-green-400/50' : 'bg-transparent text-gray-500 border-gray-500'}`}>
                          {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-[11px] uppercase tracking-widest font-bold">
                        {currentUserRole === 'superadmin' || user.role !== 'superadmin' ? (
                          <>
                            <button 
                              onClick={() => startEditUser(user)}
                              className="text-gray-300 hover:text-white mr-6 transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-gray-300 hover:text-white transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-600 font-mono">RESTRICTED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Edit User Modal */}
            {editingUserId !== null && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div className="bg-black border border-white p-8 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold tracking-[0.15em] uppercase mb-8 text-white">Edit User</h3>
                  <form onSubmit={handleUpdateUser} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Username</label>
                      <input autoFocus required type="text" value={editUserForm.full_name} onChange={e => setEditUserForm({...editUserForm, full_name: e.target.value})} className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Email Address</label>
                      <input required type="email" value={editUserForm.email} onChange={e => setEditUserForm({...editUserForm, email: e.target.value})} className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Password <span className="text-gray-600">(Leave blank to keep current)</span></label>
                      <input minLength={8} type="password" value={editUserForm.password} onChange={e => setEditUserForm({...editUserForm, password: e.target.value})} className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Role Placement</label>
                      <select value={editUserForm.role} onChange={e => setEditUserForm({...editUserForm, role: e.target.value})} className="bg-black border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm cursor-pointer appearance-none rounded-none">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={editUserForm.is_active} onChange={e => setEditUserForm({...editUserForm, is_active: e.target.checked})} className="w-5 h-5 accent-white cursor-pointer bg-black border-white" />
                        Active Account
                      </label>
                    </div>
                    <div className="flex justify-end gap-6 mt-8">
                      <button type="button" onClick={() => setEditingUserId(null)} className="text-gray-400 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">Cancel</button>
                      <button type="submit" className="border border-white bg-white text-black px-8 py-3 text-xs uppercase tracking-widest font-bold transition-colors hover:bg-black hover:text-white">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Create User Modal */}
            {isAddingUser && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div className="bg-black border border-white p-8 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold tracking-[0.15em] uppercase mb-8 text-white">Create New User</h3>
                  <form onSubmit={handleCreateUser} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Username</label>
                      <input autoFocus required type="text" value={newUserForm.full_name} onChange={e => setNewUserForm({...newUserForm, full_name: e.target.value})} className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Email Address</label>
                      <input required type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Password</label>
                      <input required minLength={8} type="password" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Role Placement</label>
                      <select value={newUserForm.role} onChange={e => setNewUserForm({...newUserForm, role: e.target.value})} className="bg-black border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm cursor-pointer appearance-none rounded-none">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={newUserForm.is_active} onChange={e => setNewUserForm({...newUserForm, is_active: e.target.checked})} className="w-5 h-5 accent-white cursor-pointer bg-black border-white" />
                        Active Account
                      </label>
                    </div>
                    <div className="flex justify-end gap-6 mt-8">
                      <button type="button" onClick={() => setIsAddingUser(false)} className="text-gray-400 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">Cancel</button>
                      <button type="submit" className="border border-white bg-white text-black px-8 py-3 text-xs uppercase tracking-widest font-bold transition-colors hover:bg-black hover:text-white">Create Account</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'system' && (
          <div className="w-full flex-grow flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-bold tracking-wide uppercase">System Analytics</h2>
              <span className="text-[10px] tracking-widest uppercase text-green-400 border border-green-400/50 px-3 py-1">Systems Nominal</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="border border-white/30 p-6 bg-[#0a0a0a] flex flex-col gap-2 hover:border-white transition-colors cursor-default">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Database Objects</span>
                <span className="text-3xl font-mono text-white tracking-widest">1,248</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-2">PostgreSQL (Users & Metadata)</span>
              </div>
              
              {/* Metric 2 */}
              <div className="border border-white/30 p-6 bg-[#0a0a0a] flex flex-col gap-2 hover:border-white transition-colors cursor-default">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Storage Quota</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono text-white tracking-widest">4.2</span>
                  <span className="text-sm font-mono text-gray-400">/ 109 GB</span>
                </div>
                <div className="w-full h-1 bg-white/10 mt-2 rounded">
                  <div className="h-full bg-white w-[4%] rounded shadow-[0_0_10px_#fff]"></div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="border border-white/30 p-6 bg-[#0a0a0a] flex flex-col gap-2 hover:border-white transition-colors cursor-default">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Worker Status</span>
                <span className="text-3xl font-mono text-white tracking-widest">Idle</span>
                <div className="flex gap-3 text-[9px] text-gray-500 uppercase tracking-widest mt-2">
                  <span><span className="text-white">0</span> Active</span>
                  <span><span className="text-white">0</span> Queued</span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="border border-white/30 p-6 bg-[#0a0a0a] flex flex-col gap-2 hover:border-white transition-colors cursor-default">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">API Latency</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono text-white tracking-widest">24</span>
                  <span className="text-sm font-mono text-gray-400">ms</span>
                </div>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-2">FastAPI Core Average</span>
              </div>
            </div>

            {/* Active Sessions Table */}
            <div className="mt-2 text-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400">Active Authentication Sessions</h3>
              </div>
              <div className="bg-transparent border border-white/50 w-full overflow-hidden">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-[#111] uppercase tracking-widest text-[10px] text-gray-400">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Session ID</th>
                      <th className="px-6 py-4 text-left font-bold">User UID</th>
                      <th className="px-6 py-4 text-left font-bold">Status</th>
                      <th className="px-6 py-4 text-right font-bold">Uptime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap text-gray-400 font-mono text-xs">jwt_7f8a9...2b1</td>
                      <td className="px-6 py-5 whitespace-nowrap text-white text-xs font-mono">auth|superadmin|mrwizard</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-[9px] tracking-widest uppercase font-bold border bg-transparent text-green-400 border-green-400/50">Active</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-gray-400 font-mono text-xs">02:14:32</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap text-gray-400 font-mono text-xs">jwt_3c4d5...9e2</td>
                      <td className="px-6 py-5 whitespace-nowrap text-white text-xs font-mono">auth|admin|assistant</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-[9px] tracking-widest uppercase font-bold border bg-transparent text-yellow-400 border-yellow-400/50">Idle</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-gray-400 font-mono text-xs">00:45:11</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="w-full flex-grow flex flex-col h-[600px]">
            <h2 className="text-md font-bold tracking-wide uppercase mb-2">Live System Logs</h2>
            <div className="flex-grow bg-black border border-white/20 p-4 overflow-y-auto font-mono text-sm shadow-inner mt-4 rounded-sm">
              <div className="text-green-500 mb-1">[INFO] 2026-05-08 14:32:01 - logger.setup - Initialized system logging on Master.</div>
              <div className="text-green-500 mb-1">[INFO] 2026-05-08 14:32:02 - uvicorn.error - Started server process [2934]</div>
              <div className="text-green-500 mb-1">[INFO] 2026-05-08 14:32:02 - uvicorn.error - Waiting for application startup.</div>
              <div className="text-green-500 mb-1">[INFO] 2026-05-08 14:32:02 - uvicorn.error - Application startup complete.</div>
              <div className="text-green-500 mb-1">[INFO] 2026-05-08 14:32:02 - uvicorn.error - Uvicorn running on http://127.0.0.1:8080 (Press CTRL+C to quit)</div>
              <div className="text-blue-400 mb-1">[DEBUG] 2026-05-08 14:33:15 - auth.core - Incoming authentication request for user: mrwizard@bourbonhub.com</div>
              <div className="text-green-500 mb-1">[INFO] 2026-05-08 14:33:16 - auth.core - User mrwizard@bourbonhub.com authenticated successfully. JWT issued.</div>
              <div className="text-white mb-1">[HTTP] 2026-05-08 14:33:16 - fastapi.requests - GET /users/ HTTP/1.1 200 OK</div>
              <div className="text-blue-400 mb-1">[DEBUG] 2026-05-08 14:35:10 - worker.celery - Checking queue for pending scraping tasks...</div>
              <div className="text-white mb-1">[HTTP] 2026-05-08 14:36:20 - fastapi.requests - GET /api/db-status HTTP/1.1 200 OK</div>
              <div className="text-yellow-400 mb-1">[WARN] 2026-05-08 14:40:05 - s3.storage - Upload bandwidth reaching 80% throttle threshold.</div>
              <div className="text-red-500 mb-1">[ERROR] 2026-05-08 14:42:12 - worker.celery - Connection to Redis broker temporarily lost. Retrying in 5s...</div>
              <div className="text-green-500 mb-1">[INFO] 2026-05-08 14:42:17 - worker.celery - Reconnected to Redis broker successfully.</div>
              <div className="text-gray-500 mt-4 italic">Waiting for incoming logs...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Management Interface...</div>}>
      <AdminContent />
    </Suspense>
  );
}
