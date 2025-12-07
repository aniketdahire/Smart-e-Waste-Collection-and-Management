import React from 'react';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
          
          <div className="relative px-6 py-20 sm:px-12 sm:py-24 lg:py-32 lg:px-20 flex flex-col items-center text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
              Ready to make a <span className="text-green-200">real impact?</span>
            </h2>
            <p className="mt-4 text-xl text-green-50 max-w-2xl mb-10">
              Join thousands of others who are cleaning up the planet, one device at a time. It takes less than 2 minutes to schedule your first pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-green-700 hover:text-green-800 shadow-xl">
                Create Free Account
              </Button>
              <Button size="lg" className="w-full sm:w-auto bg-green-700 text-white border border-green-500 hover:bg-green-800 shadow-xl">
                Schedule Pickup <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
