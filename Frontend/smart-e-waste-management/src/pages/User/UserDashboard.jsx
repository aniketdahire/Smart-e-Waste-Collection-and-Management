import React, { useState, useEffect } from 'react';
import collectionService from '../../services/collectionService';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import UserLayout from '../../components/layout/UserLayout';
import { FileText, Clock, Calendar, CheckCircle, XCircle, MapPin, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const UserDashboard = () => {
  const [profile, setProfile] = useState({ fullName: '' });
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    scheduled: 0,
    completed: 0,
    rejected: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileData, requestsData] = await Promise.all([
        userService.getProfile(),
        collectionService.getMyRequests()
      ]);

      setProfile({ fullName: profileData.fullName || 'User' });

      // Process Stats
      const pending = requestsData.filter(r => r.status === 'PENDING').length;
      const scheduled = requestsData.filter(r => r.status === 'IN_PROGRESS').length;
      const completed = requestsData.filter(r => r.status === 'COMPLETED').length;
      const rejected = requestsData.filter(r => r.status === 'REJECTED' || r.status === 'CANCELLED').length;

      setStats({
        total: requestsData.length,
        pending,
        scheduled,
        completed,
        rejected,
      });

      // Process Recent Requests (Sort by ID desc as proxy for time if date not available, or use createdAt if available. Let's assume createdAt or just ID desc)
      // Assuming requestsData has 'id' or 'createdAt'. Best to sort by ID desc if simple, or createdAt.
      const sorted = [...requestsData].reverse(); // Simple reverse for now assuming generic order.
      setRecentRequests(sorted.slice(0, 5));

      // Process Chart Data
      setChartData([
        { name: 'Pending', value: pending, color: '#F59E0B' },   // Amber
        { name: 'Scheduled', value: scheduled, color: '#6366F1' }, // Indigo
        { name: 'Completed', value: completed, color: '#10B981' }, // Emerald
        { name: 'Rejected', value: rejected, color: '#EF4444' },   // Red
      ].filter(item => item.value > 0));

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      toast.error("Failed to load dashboard data", 3000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };



  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-amber-100 text-amber-700 border-amber-200">PENDING</span>;
      case 'IN_PROGRESS': return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-indigo-100 text-indigo-700 border-indigo-200">IN PROGRESS</span>;
      case 'COMPLETED': return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-700 border-emerald-200">COMPLETED</span>;
      case 'REJECTED': return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-700 border-red-200">REJECTED</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-600">UNKNOWN</span>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <UserLayout>
        {/* MINIMAL HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                {/* <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1> */}
                <p className="text-gray-500 text-sm mt-1">Welcome back, <span className="font-semibold text-gray-700">{profile.fullName}</span></p>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Verified Account</span>
            </div>
        </div>

        {/* 5-COLUMN KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            
            {/* TOTAL REQUESTS */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</p>
                    </div>
                    <div className="p-2.5 bg-sky-50 rounded-lg text-sky-600">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* PENDING */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pending}</p>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-lg text-amber-500">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* SCHEDULED (IN PROGRESS) */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Scheduled</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats.scheduled}</p>
                    </div>
                    <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-500">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
            </div>

             {/* COMPLETED */}
             <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Completed</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats.completed}</p>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-500">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>

             {/* REJECTED */}
             <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Rejected</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats.rejected}</p>
                    </div>
                    <div className="p-2.5 bg-red-50 rounded-lg text-red-500">
                        <XCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>

        </div>

        {/* BOTTOM SECTION: RECENT ACTIVITY & CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: RECENT ACTIVITY (Takes 2/3 space) */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                    </div>

                    {recentRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-100">
                                        <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-4">Item</th>
                                        <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-4">Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentRequests.map((req) => (
                                        <tr 
                                            key={req.id} 
                                            onClick={() => setSelectedRequest(req)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 pl-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                        <img 
                                                            src={`http://localhost:8080/uploads/${req.imagePath}`} 
                                                            alt={req.deviceType}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null; 
                                                                e.target.src = "https://via.placeholder.com/100?text=EW";
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{req.deviceType}</p>
                                                        <p className="text-xs text-gray-500">{req.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                                    ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                                                      req.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-700' :
                                                      req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                      'bg-gray-100 text-gray-700'}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-sm text-gray-500 text-right pr-4">{req.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                         <p className="text-gray-500 text-sm text-center py-4">No recent activity found.</p>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: STATUS DISTRIBUTION CHARTS */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
                 <h2 className="text-lg font-bold text-gray-800 self-start mb-4">Request Status</h2>
                 {chartData.length > 0 ? (
                     <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                 ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No data to display
                    </div>
                 )}
            </div>
            
        </div>
        {/* DETAILS MODAL */}
        {selectedRequest && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setSelectedRequest(null)}
            >
                <div 
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                >
                    {/* Modal Image Header */}
                    <div className="relative h-56 sm:h-72 bg-gray-100 flex-shrink-0">
                        <img 
                            className="w-full h-full object-contain" 
                            src={`http://localhost:8080/uploads/${selectedRequest.imagePath}`} 
                            alt={selectedRequest.deviceType}
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                            }}
                        />
                        <button 
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full backdrop-blur-md transition-all shadow-sm"
                        >
                            <span className="font-bold text-gray-600">✕</span>
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.deviceType}</h2>
                                <p className="text-gray-500 text-base sm:text-lg">{selectedRequest.brand} • {selectedRequest.model}</p>
                            </div>
                            <div className="sm:mt-1 shrink-0">
                                {getStatusBadge(selectedRequest.status)}
                            </div>
                        </div>
                        

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Condition</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.condition || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Quantity</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.quantity}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Pickup Date</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.pickupDate || 'Not Scheduled'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Pickup Time</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.pickupTime || 'Not Scheduled'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Pickup Location
                                </h4>
                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm sm:text-base leading-relaxed">
                                    {selectedRequest.address}
                                </p>
                            </div>
                            
                            {selectedRequest.remarks && (
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                                        <Package className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Remarks
                                    </h4>
                                    <p className="text-gray-600 italic text-sm sm:text-base">
                                        "{selectedRequest.remarks}"
                                    </p>
                                </div>
                            )}

                             <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
                                <span>Request ID: {selectedRequest.id}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(selectedRequest.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </UserLayout>
  );
};

export default UserDashboard;
