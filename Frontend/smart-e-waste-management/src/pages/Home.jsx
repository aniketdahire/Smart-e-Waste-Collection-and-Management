import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Stats from '../components/home/Stats';
import CallToAction from '../components/home/CallToAction';

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <CallToAction />
    </div>
  );
};

export default Home;
