import React from 'react';
import Button from '../common/Button';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import heroIllustration from '../../assets/hero-illustration.png';

const Hero = () => {
  return (
    <section className="relative min-h-[110vh] flex items-center bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 rounded-full bg-green-50 border border-green-100 mb-4 transition-transform hover:scale-105 duration-300">
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-green-800 tracking-wide uppercase">Smart e-Waste Management</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
              Recycling made <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Simple & Smart.
              </span>
            </h1>
            
            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-light max-w-lg">
              Transform your e-waste into sustainable impact. We provide an elegant solution for collecting, recycling, and repurposing your old electronics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <Button size="lg" className="rounded-full px-8 py-4 text-lg bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Start Recycling
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-gray-700 font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 text-green-600 fill-current" />
                </div>
                How it works
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm font-medium text-gray-500 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Certified Recyclers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Eco-Friendly Process</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-left">
             <div className="relative w-full max-w-xl">
                {/* Minimal background accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100/50 to-emerald-50/50 rounded-[3rem] transform rotate-6 scale-90 -z-10 blur-xl"></div>
                
                <img 
                  src={heroIllustration} 
                  alt="Smart E-Waste Collection Illustration" 
                  className="relative z-10 w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.01] transition-transform duration-700 ease-out"
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
