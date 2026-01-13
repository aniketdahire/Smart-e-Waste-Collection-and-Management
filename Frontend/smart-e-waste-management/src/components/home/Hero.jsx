import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { ArrowRight, Play, CheckCircle, Leaf, Shield } from 'lucide-react';
import heroIllustration from '../../assets/hero-illustration.png';

const highlights = [
  { icon: CheckCircle, label: 'Certified recyclers' },
  { icon: Shield, label: 'Secure data wiping' },
  { icon: Leaf, label: 'Zero-landfill pledge' },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-green-50/40 to-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-green-50 rounded-full blur-2xl opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          {/* Text Column */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-green-100 text-sm font-semibold text-green-700">
              Smart e-Waste Platform
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Earth-positive pickups for every household and campus.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl">
                Book a slot, hand over your devices, and watch them get transformed into
                reusable materials—with live tracking, instant certificates, and community rewards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/request-collection" className="inline-flex">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 py-4 text-lg bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  Book a pickup
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services" className="inline-flex">
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-700 font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                    <Play className="w-4 h-4 text-green-600" />
                  </div>
                  See how it works
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-100 rounded-2xl p-6 bg-white/70 backdrop-blur">
              {highlights.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <item.icon className="w-5 h-5 text-green-500" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/60 to-white rounded-[2.5rem] rotate-3 scale-95 blur-xl" />
            <img
              src={heroIllustration}
              alt="Smart e-waste collection illustration"
              className="relative z-10 w-full max-w-xl mx-auto drop-shadow-2xl object-contain"
            />
            <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">48k pickups completed</p>
                <p className="text-xs text-gray-500">Avg. rating 4.9/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
