import React from 'react';
import { Truck, MapPin, BarChart3, ShieldCheck, Zap, Globe, Cpu, Smartphone } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-3">Our Core Advantages</h2>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Smart technology for a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Cleaner Planet</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 grid-rows-[auto]">
          {/* Card 1: Large Feature */}
          <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 sm:p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-green-100"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Pickup Logistics</h3>
              <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                Our AI-driven fleet management system optimizes routes in real-time to ensure the fastest collection service while minimizing carbon emissions.
              </p>
            </div>
            <div className="absolute bottom-10 right-10 hidden lg:block opacity-50 group-hover:opacity-100 transition-opacity">
               <MapPin className="w-24 h-24 text-green-100" />
            </div>
          </div>

          {/* Card 2: Vertical Highlight */}
          <div className="lg:col-span-2 bg-gray-900 rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-900/20 to-transparent"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[200px]">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-green-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">100% Data Security</h3>
                <p className="text-gray-400">
                  Department of Defense standard data wiping for all collected devices.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Small */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Impact Tracking</h3>
            <p className="text-gray-500 text-sm">Visualize your environmental contribution in real-time.</p>
          </div>

           {/* Card 4: Small */}
           <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-600 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Rewards</h3>
            <p className="text-gray-500 text-sm">Get points immediately after successful pickup verification.</p>
          </div>

           {/* Card 5: Medium */}
           <div className="lg:col-span-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2rem] p-8 text-white shadow-lg hover:shadow-xl transition-all duration-500 group">
            <div className="flex flex-col h-full justify-between min-h-[180px]">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 text-white">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Global Standards</h3>
                <p className="text-green-50 text-sm">WEEE, ISO 14001, and R2 compliant recycling processes.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
