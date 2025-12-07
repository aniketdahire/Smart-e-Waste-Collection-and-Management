import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { ArrowRight, Chrome, Github } from 'lucide-react';
import registerIllustration from '../assets/register-illustration.png';

const Register = () => {
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

            {/* Social Auth */}
            {/* <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Chrome className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Github className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">GitHub</span>
              </button>
            </div> */}

            {/* <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or continue with</span></div>
            </div> */}

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Input id="name" label="Full Name" placeholder="John Doe" type="text" />
              <Input id="email" label="Email Address" placeholder="name@example.com" type="email" />
              <Input id="password" label="Password" placeholder="••••••••" type="password" />
              
              <Button size="lg" className="w-full rounded-xl py-3 text-lg shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5 transition-all">
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
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
          {/* Background Blobs */}
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
