import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import UserLayout from '../../components/layout/UserLayout';
import { RotateCw, CheckCircle, Leaf } from 'lucide-react';

const UserDashboard = () => {
  const [profile, setProfile] = useState({ fullName: '' });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile({ fullName: data.fullName || 'User' });
    } catch (error) {
      // Check for exact error 
      console.error("Dashboard Fetch Error:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard data", 3000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <UserLayout>
        {/* MINIMAL HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
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

        {/* COMPACT STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Recycled</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">0 <span className="text-sm font-normal text-gray-500">kg</span></p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <RotateCw className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Carbon Saved</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">0 <span className="text-sm font-normal text-gray-500">kg</span></p>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <Leaf className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Requests</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">0</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>

        {/* Empty State / Call to Action */}
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <h3 className="text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by requesting a recycling pickup.</p>
        </div>
    </UserLayout>
  );
};

export default UserDashboard;
