import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

const channels = [
  { icon: Mail, heading: 'Email us', detail: 'support@smartewaste.org', helper: 'We reply in under 6 hours.' },
  { icon: Phone, heading: 'Call center', detail: '+91 98765 43210', helper: 'Weekdays 9 AM – 7 PM' },
  { icon: MapPin, heading: 'Main hub', detail: '21 Green Loop, Pune', helper: 'Open for drop-offs Mon–Sat' },
];

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white shadow-sm border border-gray-200 text-sm font-semibold text-gray-900">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Contact us
            </div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Let’s plan your next zero-waste pickup together.
            </h1>
            <p className="text-gray-500 text-lg">
              Our sustainability specialists are on standby to help you with pickup scheduling, enterprise programs,
              compliance paperwork, and everything in between.
            </p>
          </div>

          <div className="space-y-5">
            {channels.map((item) => (
              <article key={item.heading} className="flex gap-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">{item.heading}</p>
                  <p className="text-xl font-semibold text-gray-900">{item.detail}</p>
                  <p className="text-sm text-gray-500">{item.helper}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 p-8 flex items-center gap-6">
            <Clock className="w-10 h-10 text-emerald-500" />
            <div>
              <p className="text-gray-900 font-semibold">Average resolution time</p>
              <p className="text-gray-500 text-sm">2 hours for residential, 1 business day for enterprises</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-emerald-100/40 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Send a message</h2>
          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">Full name</label>
              <input
                type="text"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50"
                placeholder="Alex Green"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="tel"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50"
                  placeholder="+91 9XXXX XXXXX"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Message</label>
              <textarea
                rows="4"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50"
                placeholder="Tell us about the devices you want to recycle..."
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800 transition-colors"
            >
              Send message
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
