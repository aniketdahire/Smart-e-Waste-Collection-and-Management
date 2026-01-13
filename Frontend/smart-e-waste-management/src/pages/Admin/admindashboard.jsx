import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Ban,
  TrendingUp,
  Activity,
  Truck,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import userService from '../../services/userService';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, requestsData] = await Promise.all([
        userService.getUsers(),
        adminService.getAllRequests()
      ]);
      setUsers(usersData);
      setRequests(requestsData);
    } catch (error) {
      toast.error('Failed to fetch dashboard data', 3000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };

  // --- DATA AGGREGATION ---

  const suspendedCount = users.filter(u => u.status === 'SUSPENDED').length;
  // Request Stats
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const inProgressRequests = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const rejectedRequests = requests.filter(r => r.status === 'REJECTED').length;

  // Pie Chart Data
  const statusData = [
    { name: 'Pending', value: pendingRequests, color: '#f59e0b' }, // Amber
    { name: 'In Progress', value: inProgressRequests, color: '#3b82f6' }, // Blue
    { name: 'Completed', value: completedRequests, color: '#10b981' }, // Emerald
    { name: 'Rejected', value: rejectedRequests, color: '#ef4444' }, // Red (Requested)
  ].filter(d => d.value > 0);

  // Waste Stats
  const wasteTypeCount = requests.reduce((acc, curr) => {
    const type = curr.deviceType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const wasteData = Object.keys(wasteTypeCount).map(key => ({
    name: key,
    count: wasteTypeCount[key]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  // Weekly Trend
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };
  const dayLabels = getLast7Days();
  const trendData = dayLabels.map(date => {
      const count = requests.filter(r => r.createdAt && r.createdAt.startsWith(date)).length;
      return {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          requests: count
      };
  });

  const recentActivity = [...requests]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

  if (loading) {
      return (
          <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
      );
  }

  return (
    <div className="space-y-6 sm:space-y-8 bg-gray-50/30 min-h-screen font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
              {/* <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Dashboard</h2> */}
              <p className="text-gray-500 mt-1 font-medium">Overview of system performance</p>
          </div>
          <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                  <span className="hidden xs:inline">Today</span>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <StatCard 
            title="Total Users" 
            value={users.length} 
            icon={<Users className="w-6 h-6 text-white" />} 
            color="bg-gradient-to-br from-indigo-500 to-purple-600"
          />
          <StatCard 
            title="Total Requests" 
            value={requests.length} 
            icon={<Truck className="w-6 h-6 text-white" />} 
            color="bg-gradient-to-br from-emerald-400 to-teal-500"
          />
           <StatCard 
            title="Pending Actions" 
            value={pendingRequests} 
            icon={<AlertCircle className="w-6 h-6 text-white" />} 
            color="bg-gradient-to-br from-amber-400 to-orange-500"
            subtext="Requires approval"
          />
           <StatCard 
            title="Rejected Items" 
            value={rejectedRequests} 
            icon={<XCircle className="w-6 h-6 text-white" />} 
            color="bg-gradient-to-br from-red-500 to-pink-600" // RED as requested
            subtext="Total rejections"
          />
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* ACTIVITY TREND */}
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Weekly Collection Analytics</h3>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wide w-max">
                        <TrendingUp className="w-3 h-3" />
                        Live Data
                    </div>
                </div>
                <div className="h-[260px] sm:h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 500}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* STATUS DISTRIBUTION */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 sm:mb-6">Request Distribution</h3>
                <div className="h-[260px] sm:h-[320px] w-full relative flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={6}
                                dataKey="value"
                                cornerRadius={6}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                         <div className="text-center">
                            <span className="text-3xl font-extrabold text-gray-800">{requests.length}</span>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* CHARTS ROW 2: WASTE TYPES & RECENT ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* WASTE BY CATEGORY */}
             <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 sm:mb-6">Top Collected Items</h3>
                <div className="h-[260px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={wasteData} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f9fafb" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280', fontWeight: 500}} />
                            <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={24}>
                                {wasteData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4 sm:mb-6">Recent Transactions</h3>
                <div className="flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50">
                            <tr className="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                                <th className="pb-4 pl-2">User</th>
                                <th className="pb-4">Item</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4 text-right pr-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentActivity.map(req => (
                                <tr key={req.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="py-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shadow-inner">
                                                {req.user?.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{req.user?.fullName}</p>
                                                <p className="text-[10px] text-gray-400">{req.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-600 font-medium">{req.deviceType} <span className="text-gray-400 font-normal">({req.quantity})</span></td>
                                    <td className="py-4 text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="py-4 text-right pr-2">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                            req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                            req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                            req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : // RED REJECT
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, shadow, subtext }) => {
    return (
      <div className={`p-6 rounded-2xl bg-white ${shadow} shadow-lg border border-gray-100 relative overflow-hidden group`}>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">{title}</p>
                <h4 className="text-3xl font-extrabold text-gray-800 tracking-tight">{value}</h4>
                {subtext && <p className="text-xs text-gray-400 mt-2 font-medium">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
        </div>
        {/* Decorative Circle */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      </div>
    );
};

export default AdminDashboard;
