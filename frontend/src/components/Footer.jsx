import React from 'react';
import { Facebook } from 'lucide-react';
import { contactData } from '../mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">PZE</h3>
            <p className="text-sm text-slate-400">
              Professional moving, junk hauling, and yard services in Taft, CA and surrounding areas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  About & Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('quote')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Get a Quote
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('reviews')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-500">Ricardo:</span>{' '}
                <a 
                  href={`tel:${contactData.ricardo.replace(/\D/g, '')}`}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {contactData.ricardo}
                </a>
              </li>
              <li>
                <span className="text-slate-500">Edgar:</span>{' '}
                <a 
                  href={`tel:${contactData.edgar.replace(/\D/g, '')}`}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {contactData.edgar}
                </a>
              </li>
              <li className="text-slate-400 pt-2">
                {contactData.serviceArea}
              </li>
              <li className="pt-2">
                <a 
                  href={contactData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Follow us on Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>© {currentYear} PZE Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
