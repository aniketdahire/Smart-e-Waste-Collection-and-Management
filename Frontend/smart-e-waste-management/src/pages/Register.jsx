import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { ArrowRight } from 'lucide-react';
import registerIllustration from '../assets/register-illustration.png';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      toast.success('Account Created! Redirecting to verification...', 3000, "bottom-center");
      // Redirect to Verify Email page with email in state
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.', 5000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl min-h-[400px] lg:h-[620px] relative overflow-hidden flex border border-gray-100">
        
        {/* FORM SECTION - LEFT */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-16 relative z-10 animate-swap-left">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Create Account</h1>
              <p className="text-gray-500">Fill in the information to get started</p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <Input 
                id="fullName" 
                label="Full Name" 
                placeholder="John Doe" 
                type="text" 
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input 
                id="email" 
                label="Email Address" 
                placeholder="name@example.com" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input 
                id="phone" 
                label="Phone Number" 
                placeholder="1234567890" 
                type="tel" 
                value={formData.phone}
                onChange={handleChange}
                required
              />
              
              <Button 
                size="lg" 
                className="w-full rounded-xl py-3 text-lg shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5 transition-all"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-green-600 hover:underline transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* IMAGE SECTION - RIGHT */}
        <div className="hidden lg:flex w-1/2 bg-green-50 items-center justify-center p-12 relative overflow-hidden animate-swap-right">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/40 rounded-full blur-3xl animate-blob"></div>
             <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">Join the Revolution</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Start your sustainable journey today. Connect with certified recyclers instantly.
            </p>
            <img 
              src={registerIllustration} 
              alt="Register Illustration" 
              className="w-full max-w-sm mx-auto drop-shadow-2xl rounded-xl hover:scale-102 transition-transform duration-500" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
