import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  LogOut, 
  ChevronRight,
  Briefcase
} from 'lucide-react';
import authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    toast.info('Logged out successfully', 3000, "bottom-center");
  };

  const getPageTitle = (pathname) => {
    if (pathname.includes('/admin/users')) return 'User Management';
    if (pathname.includes('/admin/requests')) return 'Request Management';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
             E
           </div>
           <span className="ml-3 font-bold text-gray-800 tracking-tight">Smart E-Waste Admin</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem
            to="/admin"
            end
            icon={<LayoutDashboard />}
            label="Dashboard"
          />
          <NavItem
            to="/admin/users"
            icon={<Users />}
            label="Users"
          />
          <NavItem
            to="/admin/requests"
            icon={<Truck />}
            label="Requests"
          />
          <NavItem
            to="/admin/personnel"
            icon={<Briefcase />}
            label="Personnel"
          />
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
          <h2 className="text-lg font-semibold text-gray-800">{getPageTitle(location.pathname)}</h2>
          
          <div className="flex items-center gap-6">
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
        <div className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, to, end }) => (
  <NavLink 
    to={to}
    end={end}
    className={({ isActive }) => `w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
    isActive 
      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'
  }`}>
    <span className="w-5 h-5 mr-3 opacity-90">{icon}</span>
    {label}
  </NavLink>
);

export default AdminLayout;
