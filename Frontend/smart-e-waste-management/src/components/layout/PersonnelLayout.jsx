import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X, ChevronDown, User } from 'lucide-react';
import authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import userService from '../../services/userService';

const PersonnelLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInitial, setUserInitial] = useState('P');
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  React.useEffect(() => {
    const fetchUserInitial = async () => {
      try {
        const response = await userService.getProfile();
        const data = response.data || response;
        if (data.fullName) {
            setUserInitial(data.fullName.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Failed to load user initial", error);
      }
    };
    fetchUserInitial();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    toast.info("Logged out successfully", 2000, "bottom-center");
  };

  const navItems = [
    { name: 'Dashboard', path: '/personnel-dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shadow-2xl lg:shadow-none`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-gray-50 bg-emerald-600">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              P
            </div>
            <span className="ml-3 text-xl font-bold text-white tracking-tight">Staff Portal</span>
            <button 
                onClick={() => setIsOpen(false)} 
                className="ml-auto lg:hidden text-white/70 hover:text-white"
            >
                <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
                Menu
            </div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm ring-1 ring-emerald-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`transition-colors ${isActive(item.path) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                  <LogOut className="w-5 h-5" />
                  Sign Out
              </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
           <div className="flex items-center gap-3 lg:hidden">
              <button 
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
           </div>

           <div className="hidden lg:block"></div>

           <div className="flex items-center gap-4 sm:gap-6">
            

              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                    <div className="w-9 h-9 bg-gradient-to-tr from-emerald-100 to-green-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                        {userInitial}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showProfileMenu && (
                    <>
                        <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setShowProfileMenu(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 animate-fade-in-up origin-top-right">
                            <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                <p className="text-sm font-semibold text-gray-800">My Account</p>
                            </div>
                            
                            <Link 
                                to="/personnel-profile" 
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                                onClick={() => setShowProfileMenu(false)}
                            >
                                <User className="w-4 h-4" />
                                My Profile
                            </Link>

                            <div className="border-t border-gray-50 mt-1 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
              </div>
           </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
};

export default PersonnelLayout;
