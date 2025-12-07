import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Recycle, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
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
            EcoVault
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {['Home', 'Services', 'Impact', 'Contact'].map((item) => (
            <Link 
              key={item}
              to={`/${item.toLowerCase()}`} 
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors relative group py-2"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
          <div className="relative">
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
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-50">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-800 hover:text-green-600 transition-colors relative z-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {['Home', 'Services', 'Impact', 'Contact'].map((item) => (
             <a 
               key={item}
               href={`#`}
               onClick={(e) => {
                 e.preventDefault();
                 setMobileMenuOpen(false);
               }}
               className="text-3xl font-bold text-gray-900 hover:text-green-600 transition-colors"
             >
               {item}
             </a>
          ))}
          
          <div className="flex flex-col gap-4 mt-8 w-64">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button size="lg" variant="outline" className="w-full rounded-full text-lg border-2">
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button size="lg" className="w-full rounded-full text-lg shadow-xl">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
