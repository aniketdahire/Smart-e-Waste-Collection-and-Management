import React from 'react';
import { Recycle, ShieldCheck, Truck, TrendingUp, Sparkles } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Doorstep Collection',
    description:
      'Flexible scheduling with live tracking so your e-waste leaves your home safely and on time.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Data Wiping',
    description:
      'Certified erasure of personal data before devices are recycled or refurbished.',
  },
  {
    icon: Recycle,
    title: 'Responsible Recycling',
    description:
      'ISO-compliant dismantling partners ensure zero landfill contribution.',
  },
  {
    icon: TrendingUp,
    title: 'Impact Analytics',
    description:
      'Dashboards that show carbon savings, metal recovery, and community impact.',
  },
];

const Services = () => {
  return (
    <div className="pt-28 pb-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Services
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Everything you need for effortless recycling
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            We combine logistics, compliance, and technology into one seamless experience so you can
            dispose of electronics with confidence.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow bg-white"
            >
              <service.icon className="w-10 h-10 text-green-600 mb-5" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-500 text-base leading-relaxed">{service.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-gray-900 text-white p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-4">
              <p className="text-sm uppercase tracking-widest text-green-300 font-semibold">
                Better together
              </p>
              <h2 className="text-3xl font-bold leading-snug">
                Enterprise-grade workflows with neighborhood-level care.
              </h2>
              <p className="text-gray-300">
                Whether you are a single household or a multi-campus organization, our scheduling
                engine, compliance reporting, and communication tools adapt to your needs while
                staying human and approachable.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { label: 'Pickup Slots', value: '24/7' },
                { label: 'Avg. Response', value: '< 30 min' },
                { label: 'Cities Served', value: '35+' },
                { label: 'Client Retention', value: '92%' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 rounded-2xl p-6 flex flex-col items-start gap-2 border border-white/10"
                >
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wide text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
