import React from 'react';
import { Diamond, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <Diamond className="h-6 w-6 text-primary-600" />
            <span className="ml-2 text-lg font-heading font-semibold text-neutral-900">GemTracker</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-center text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} GemTracker. All rights reserved.
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a href="#" className="text-neutral-400 hover:text-neutral-500">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-neutral-500">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;