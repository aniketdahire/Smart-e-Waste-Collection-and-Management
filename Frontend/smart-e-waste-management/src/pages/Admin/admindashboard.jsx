import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  CheckCircle, 
  XCircle, 
  Search,
  ChevronRight,
  UserCheck,
  UserX,
  Trash2,
  Ban,
  Mail,
  Phone,
  MapPin,
  Home,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);

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


  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    toast.info('Logged out successfully', 3000, "bottom-center");
  };

  // Filter users based on search
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = users.filter(u => u.status === 'PENDING').length;
  const verifiedCount = users.filter(u => u.status === 'VERIFIED').length;
  const suspendedCount = users.filter(u => u.status === 'SUSPENDED').length;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
             E
           </div>
           <span className="ml-3 font-bold text-gray-800 tracking-tight">EcoAdmin</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
          {/* <NavItem icon={<Users />} label="Users" /> */}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
             onClick={handleLogout}
             className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-100 px-8 flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
          
          <div className="flex items-center gap-6">
             {/* Bell Icon */}
             <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>

             <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">Admin</p>
                    <p className="text-xs text-gray-400">View Profile</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                  A
                </div>
             </div>
          </div>
        </header>

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* STATS GRID - Minimal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Users" 
              value={users.length} 
              icon={<Users className="w-5 h-5 text-gray-600" />} 
            />
            <StatCard 
              title="Blocked Users" 
              value={suspendedCount} 
              icon={<Ban className="w-5 h-5 text-red-500" />} 
              info="Suspended Access"
            />
            <StatCard 
              title="Active Users" 
              value={verifiedCount} 
              icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
            />
          </div>

          {/* USER MANAGEMENT TABLE */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-320px)]">
            
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
                                <p className="text-xs text-gray-400">ID: #{user.id}</p>
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
             <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Showing {filteredUsers.length} users</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                </div>
             </div>
          </div>

        </div>
      </main>

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
                              <p className="text-emerald-400 text-sm font-medium">#{selectedUser.id}</p>
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

    </div>
  );
};

// --- Helper Components ---
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

// --- Subcomponents ---

const NavItem = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
    active 
      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'
  }`}>
    <span className="w-5 h-5 mr-3 opacity-90">{icon}</span>
    {label}
    {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
  </a>
);

const StatCard = ({ title, value, icon, info }) => {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
            {info && <p className="text-xs text-emerald-600 mt-2 font-medium">{info}</p>}
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            {icon}
          </div>
        </div>
      </div>
    );
};

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

export default AdminDashboard;
