import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please register first.", 3000, "bottom-center");
      navigate('/register');
    }
  }, [email, navigate, toast]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim().slice(0, 6).split("");
    if (data.every(char => !isNaN(char))) {
        const newOtp = [...otp];
        data.forEach((val, i) => {
            if (i < 6) newOtp[i] = val;
        });
        setOtp(newOtp);
        const focusIndex = Math.min(data.length, 5);
        inputRefs.current[focusIndex].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
        toast.error("Please enter all 6 digits.", 3000, "bottom-center");
        return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp({ email, otp: otpString });
      toast.success('Verification Successful! Temporary Password sent to your email.', 5000, "bottom-center");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Try again.', 3000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 text-center animate-fade-in-up border border-white/50">
        
        <div className="mb-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                ✉️
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-display tracking-tight">Check your email</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              We've sent a 6-digit verification code to <br/>
              <span className="font-semibold text-emerald-700">{email}</span>
            </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-center gap-2 sm:gap-4">
            {otp.map((data, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={el => inputRefs.current[index] = el}
                    value={data}
                    onChange={e => handleChange(e.target, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-3xl font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-sm"
                />
            ))}
          </div>

          <Button 
            size="lg" 
            className="w-full rounded-xl py-4 text-lg font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : 'Verify Code'}
          </Button>
        </form>

        <div className="mt-8 text-sm text-center text-gray-500 flex flex-col gap-2">
            <p>Did not receive the code?</p>
            <button type="button" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors">
              Click to resend
            </button>
        </div>
        
        <div className="mt-6"> 
          <button type="button" onClick={() => navigate('/register')} className="text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center gap-1 mx-auto transition-colors">
            <span>←</span> Back to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
