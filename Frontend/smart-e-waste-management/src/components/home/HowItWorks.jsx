import React from 'react';
import { Smartphone, Truck, Recycle, Award } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Book a Pickup',
    description: 'Select your e-waste items and schedule a convenient pickup time via our app.',
    icon: Smartphone,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    title: 'We Collect',
    description: 'Our verified collectors arrive at your doorstep to weigh and collect your electronic waste.',
    icon: Truck,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 3,
    title: 'Responsible Recycling',
    description: 'Items are transported to certified recycling centers for safe dismantling and processing.',
    icon: Recycle,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 4,
    title: 'Earn Rewards',
    description: 'Get points for every kg of e-waste recycled. Redeem them for vouchers and coupons.',
    icon: Award,
    color: 'bg-purple-100 text-purple-600',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-green-600 font-semibold tracking-wide uppercase text-sm">Simple Process</h2>
          <p className="mt-2 text-4xl font-bold text-gray-900 tracking-tight">
            From Clutter to Clean in 4 Steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
              
              {/* Step Number Badge */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-gray-50 shadow-lg">
                {step.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
