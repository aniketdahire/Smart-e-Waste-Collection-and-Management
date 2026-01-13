import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { Recycle, Menu, X, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
     const handleScroll = () => {
       setScrolled(window.scrollY > 20);
     };
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
     const currentUser = authService.getCurrentUser();
     setUser(currentUser);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
     authService.logout();
     setUser(null);
     toast.info('Logged out successfully', 3000, "bottom-center");
     navigate('/login');
     setAuthDropdownOpen(false);
  };

  const mainNav = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Impact', path: '/impact' },
    { label: 'Contact', path: '/contact' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1200] transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl border-gray-200 py-3 shadow-sm' 
          : 'bg-transparent border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group z-50">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 transition-transform group-hover:scale-105 duration-300">
            <Recycle className="w-6 h-6" />
          </div>
          <span className={`text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 ${!scrolled && 'lg:text-gray-900'}`}>
            Smart E-Waste
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {mainNav.map((item) => (
            <Link 
              key={item.label}
              to={item.path}
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
          <div className="relative">
            {user ? (
               <div className="flex items-center gap-4">
                 {user.role === 'ROLE_ADMIN' && (
                     <Link to="/admin">
                        <Button size="sm" variant="ghost" className="text-gray-600 hover:text-green-600">
                           Dashboard
                        </Button>
                     </Link>
                 )}
                 <Button 
                   onClick={handleLogout}
                   size="md" 
                   className="rounded-full px-6 bg-gray-100 text-gray-900 hover:bg-gray-200"
                 >
                   Logout
                 </Button>
               </div>
            ) : (
                <>
                <Button 
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  size="md" 
                  className="rounded-full px-6 bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Button>
                
                {/* Dropdown Menu */}
                {authDropdownOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right"
                    onMouseLeave={() => setAuthDropdownOpen(false)}
                  >
                    <div className="flex flex-col p-1">
                      <Link 
                        to="/login" 
                        className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors text-left"
                        onClick={() => setAuthDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors text-left"
                        onClick={() => setAuthDropdownOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
                </>
            )}
            
            
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden" style={{ zIndex: 1300 }}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-800 hover:text-green-600 transition-colors relative"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

       {/* Mobile Menu Overlay */}
      {mobileMenuOpen &&
        createPortal(
          <div className="md:hidden fixed inset-0 z-[1250]">
            <div className="absolute inset-0 bg-black/60" onClick={closeMobileMenu} />

            <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-slate-950 text-white flex flex-col py-6 px-5 gap-6 overflow-y-auto shadow-2xl shadow-black/40 z-[1300]">
              <div className="flex items-center justify-between">
                <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <Recycle className="w-6 h-6 text-green-400" />
                  <span className="text-lg font-semibold">Smart E-Waste</span>
                </Link>

                <button onClick={closeMobileMenu}>
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <nav className="flex flex-col gap-4 border-t border-white/10 pt-4">
                {mainNav.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-white/80 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t border-white/10 pt-4 space-y-5">
                {!user ? (
                  <>
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button className="w-full bg-green-500 hover:bg-gray-700 rounded-xl mb-3">
                        Login
                      </Button>
                    </Link>

                    <Link to="/register" onClick={closeMobileMenu}>
                      <Button className="w-full bg-green-500 hover:bg-gray-700 rounded-xl">
                        Create Account
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    {user.role === 'ROLE_ADMIN' && (
                      <Link to="/admin" onClick={closeMobileMenu}>
                        <Button className="w-full bg-gray-800 rounded-xl">Admin Dashboard</Button>
                      </Link>
                    )}

                    <Button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="w-full bg-red-500 hover:bg-red-400 rounded-xl"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </aside>
          </div>,
          document.body
        )}

            </div>
          </header>
        );
      };

export default Navbar;
