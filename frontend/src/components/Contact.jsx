import React from 'react';
import { Phone, Facebook, MapPin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { contactData } from '../mockData';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Contact PZE
            </h2>
            <p className="text-lg text-slate-300">
              If you need help with moving, hauling, yard work, cleanup, or another custom job, contact us today.
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Phone Numbers */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Call Us</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Ricardo</p>
                  <button
                    onClick={() => {
                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                      if (isMobile) {
                        window.location.href = 'tel:+17476090433';
                      } else {
                        navigator.clipboard.writeText('(747) 609-0433');
                        alert('📋 Phone number copied!\n\n(747) 609-0433\n\nPaste it into your phone app.');
                      }
                    }}
                    className="text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors block cursor-pointer"
                  >
                    {contactData.ricardo}
                  </button>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Edgar</p>
                  <button
                    onClick={() => {
                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                      if (isMobile) {
                        window.location.href = 'tel:+18053253197';
                      } else {
                        navigator.clipboard.writeText('(805) 325-3197');
                        alert('📋 Phone number copied!\n\n(805) 325-3197\n\nPaste it into your phone app.');
                      }
                    }}
                    className="text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors block cursor-pointer"
                  >
                    {contactData.edgar}
                  </button>
                </div>
              </div>
              <Button 
                onClick={() => {
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  if (isMobile) {
                    window.location.href = 'tel:+17476090433';
                  } else {
                    alert('📞 Call Ricardo: (747) 609-0433\n\nClick the phone numbers above to copy them!');
                  }
                }}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>

            {/* Service Area & Social */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Service Area</h3>
              </div>
              <p className="text-lg text-slate-300 mb-6">
                {contactData.serviceArea}
              </p>

              {/* Facebook */}
              <div className="pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-3">Follow us on social media</p>
                <a 
                  href={contactData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Facebook className="w-5 h-5 mr-2" />
                    Visit Our Facebook
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h3 className="text-xl font-semibold mb-6 text-center">Quick Actions</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Button 
                onClick={() => {
                  const element = document.getElementById('quote');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-6"
              >
                Get a Quote
              </Button>
              <Button 
                onClick={() => {
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  if (isMobile) {
                    window.location.href = 'tel:+17476090433';
                  } else {
                    alert('📞 Call Ricardo: (747) 609-0433\n\nClick phone numbers to copy them!');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-6"
              >
                Call Now
              </Button>
              <Button 
                onClick={() => {
                  const element = document.getElementById('reviews');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-slate-600 hover:bg-slate-700 text-white py-6"
              >
                Leave a Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
