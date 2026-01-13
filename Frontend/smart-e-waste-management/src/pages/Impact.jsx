import React from 'react';
import { Leaf, Award, Users, BarChart3 } from 'lucide-react';

const impactStats = [
  { label: 'Carbon Saved', value: '210T', sub: 'CO₂ offset from recycling' },
  { label: 'Devices Reused', value: '18k+', sub: 'given a second life' },
  { label: 'Communities', value: '42', sub: 'cities onboarded' },
  { label: 'Volunteers', value: '1.2k', sub: 'green champions' },
];

const Impact = () => {
  return (
    <div className="bg-white pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <section className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
            <Leaf className="w-4 h-4" />
            Impact Report
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Proof that small actions scale into real climate wins.
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Data from our recycling partners, IoT-enabled pickup fleet, and trusted carbon auditors
            keeps you informed and inspired to keep going.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-3xl border border-gray-100 bg-white shadow-sm p-8 text-center hover:shadow-xl transition-shadow"
            >
              <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                {stat.label}
              </p>
              <p className="text-gray-500 mt-3 text-sm">{stat.sub}</p>
            </article>
          ))}
        </section>

        <section className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-3xl bg-gray-900 text-white p-10 space-y-6">
            <Award className="w-10 h-10 text-emerald-300" />
            <h2 className="text-3xl font-bold">Global best practices</h2>
            <p className="text-gray-300 leading-relaxed">
              We align with WEEE, ISO 14001, and Responsible Recycling (R2) standards. Real-time
              audits ensure nothing ends up in landfills and every component is safely recovered.
            </p>
            <ul className="space-y-3 text-gray-200">
              <li>• E-waste traceability from doorstep to dismantling</li>
              <li>• Blockchain-backed certificates for enterprises</li>
              <li>• Third-party verified carbon accounting</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-100 p-10 space-y-6">
            <div className="flex items-center gap-3 text-emerald-600 font-semibold uppercase text-sm tracking-widest">
              <Users className="w-5 h-5" />
              Community Voices
            </div>
            <blockquote className="text-gray-900 text-2xl font-semibold leading-snug">
              “Our campuses divert 97% of electronics from landfills, and students actually compete
              on impact because the insights are so clear.”
            </blockquote>
            <p className="text-gray-500">— Priya Shetty, Sustainability Lead @ GreenTech Labs</p>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              {[
                { icon: BarChart3, text: 'Live ESG dashboards' },
                { icon: Leaf, text: 'UN SDG aligned' },
              ].map((item) => (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Impact;
