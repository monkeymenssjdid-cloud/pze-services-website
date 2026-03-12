import React from 'react';
import { Truck, Trash2, TreeDeciduous, Scissors, Leaf, Sprout, Wrench } from 'lucide-react';
import { aboutData, servicesData } from '../mockData';

const iconMap = {
  Truck,
  Trash2,
  TreeDeciduous,
  Scissors,
  Leaf,
  Sprout,
  Wrench
};

const About = () => {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* About Section */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {aboutData.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {aboutData.description}
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Services We Offer
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {servicesData.map((service) => {
                const IconComponent = iconMap[service.icon];
                return (
                  <div 
                    key={service.id}
                    className="flex items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">
                        {service.name}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Jobs Note */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-slate-700">
                <span className="font-semibold text-slate-900">Don't see what you need?</span> Contact us and let us know what you need. We may still be able to help depending on the type of work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
