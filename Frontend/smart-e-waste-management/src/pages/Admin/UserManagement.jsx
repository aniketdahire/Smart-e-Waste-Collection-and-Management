import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Search,
  Trash2,
  Ban,
  Mail,
  Phone,
  MapPin,
  Home
} from 'lucide-react';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users', 3000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
      try {
          await userService.updateUserStatus(userId, newStatus);
          toast.success(`User ${newStatus.toLowerCase()} successfully`, 3000, "bottom-center");
          fetchUsers();
      } catch (error) {
          toast.error("Failed to update status", 3000, "bottom-center");
      }
  };

  const handleDelete = async (userId) => {
      if(!window.confirm("Are you sure you want to permanently delete this user?")) return;

      try {
          await userService.deleteUser(userId);
          toast.success("User deleted successfully", 3000, "bottom-center");
          fetchUsers();
      } catch (error) {
          toast.error("Failed to delete user", 3000, "bottom-center");
      }
  };

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-xl font-bold text-gray-800">User Management</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400 animate-pulse">Loading data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedUser(user)}>
                        <div className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                            {user.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                            {/* <p className="text-xs text-gray-400">ID: #{user.id}</p> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status === 'VERIFIED' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {user.status === 'PENDING' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {user.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                          {user.status === 'SUSPENDED' && <XCircle className="w-3 h-3 mr-1" />}
                          {user.status}
                        </span>
                      </td>
                       <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date().toLocaleDateString()} {/* Placeholder for Joined Date */}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            {/* Actions based on Status */}
                            {user.status === 'PENDING' && (
                                 <>
                                    <button 
                                        onClick={() => handleStatusUpdate(user.id, 'SUSPENDED')}
                                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                        title="Block User"
                                    >
                                        <Ban className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors group/del"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                 </>
                            )}

                            {user.status === 'VERIFIED' && (
                                <>
                                    <button 
                                        onClick={() => handleStatusUpdate(user.id, 'SUSPENDED')}
                                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                        title="Block User"
                                    >
                                        <Ban className="w-4 h-4" />
                                    </button>
                                     <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            {user.status === 'SUSPENDED' && (
                                <>
                                    <button 
                                        onClick={() => handleStatusUpdate(user.id, 'VERIFIED')}
                                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                        title="Unblock User"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                     <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
         {/* Pagination (Visual Only) */}
         <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center sm:justify-between text-xs text-gray-500">
            <span>Showing {filteredUsers.length} users</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
            </div>
         </div>
      </div>

      {/* USER DETAIL MODAL */}
      {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">
                  
                  {/* Modal Header */}
                  <div className="bg-slate-900 p-6 text-white relative">
                      <button 
                          onClick={() => setSelectedUser(null)}
                          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                      >
                          <XCircle className="w-6 h-6 text-white/70 hover:text-white" />
                      </button>
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center text-2xl font-bold shadow-lg">
                              {selectedUser.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                              <h3 className="text-xl font-bold">{selectedUser.fullName}</h3>
                              {/* <p className="text-emerald-400 text-sm font-medium">#{selectedUser.id}</p> */}
                          </div>
                      </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                           <DetailItem label="Email" value={selectedUser.email} fullWidth icon={<Mail className="w-4 h-4"/>} />
                           <DetailItem label="Phone" value={selectedUser.phone} icon={<Phone className="w-4 h-4"/>} />
                           <DetailItem label="Status" value={selectedUser.status} isBadge status={selectedUser.status} />
                           <DetailItem label="City" value={selectedUser.city || 'Not provided'} icon={<MapPin className="w-4 h-4"/>} />
                           <DetailItem label="Address" value={selectedUser.address || 'Not provided'} fullWidth icon={<Home className="w-4 h-4"/>} />
                      </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                      <button 
                          onClick={() => setSelectedUser(null)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

// --- Helper Components & Functions ---

const DetailItem = ({ label, value, fullWidth, isBadge, status, icon }) => (
    <div className={`flex flex-col ${fullWidth ? 'col-span-2' : ''}`}>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            {icon} {label}
        </span>
        {isBadge ? (
             <span className={`inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                 {value}
             </span>
        ) : (
            <span className="text-gray-800 font-medium text-sm break-all">{value}</span>
        )}
    </div>
);

const AlertCircle = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'VERIFIED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default UserManagement;
