import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { heroData } from '../mockData';

const Hero = () => {
  const scrollToQuote = () => {
    const element = document.getElementById('quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwyfHxtb3ZpbmclMjB0cnVja3xlbnwwfHx8fDE3NzMyNzQ1MTZ8MA&ixlib=rb-4.1.0&q=85"
          alt="PZE Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            {heroData.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-6 font-medium">
            {heroData.subtitle}
          </p>
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            {heroData.description}
          </p>

          {/* Key Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-slate-200">Job-based pricing, not hourly rates</p>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-slate-200">Serving Taft, CA and surrounding areas</p>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-slate-200">Professional, efficient, and reliable service</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={scrollToQuote}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => window.location.href = 'tel:7476090433'}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-6"
            >
              Call Now
            </Button>
          </div>

          {/* Pricing Note */}
          <div className="mt-8 p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-emerald-400">Pricing Note:</span> {heroData.pricingNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
