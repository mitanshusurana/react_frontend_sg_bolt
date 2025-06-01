import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Diamond, Search, User, BarChart, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Diamond className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-heading font-bold text-neutral-900">GemTracker</span>
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                to="/" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/') 
                    ? 'border-primary-600 text-neutral-900' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/inventory" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/inventory') 
                    ? 'border-primary-600 text-neutral-900' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Inventory
              </Link>
              <Link 
                to="/reports" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/reports') 
                    ? 'border-primary-600 text-neutral-900' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Reports
              </Link>
              <Link 
                to="/analytics" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/analytics') 
                    ? 'border-primary-600 text-neutral-900' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Analytics
              </Link>
            </nav>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/gemstone/new" className="btn-primary flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Gemstone</span>
            </Link>
            <div className="relative">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6\" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6\" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 animate-slide-in-right">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/')
                  ? 'bg-primary-50 border-primary-600 text-primary-700'
                  : 'border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/inventory"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/inventory')
                  ? 'bg-primary-50 border-primary-600 text-primary-700'
                  : 'border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Inventory
            </Link>
            <Link
              to="/reports"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/reports')
                  ? 'bg-primary-50 border-primary-600 text-primary-700'
                  : 'border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </Link>
            <Link
              to="/analytics"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/analytics')
                  ? 'bg-primary-50 border-primary-600 text-primary-700'
                  : 'border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              to="/gemstone/new"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent bg-neutral-50 text-accent-500`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Add New Gemstone
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-neutral-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {user?.name.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-800">{user?.name || 'User'}</div>
                <div className="text-sm font-medium text-neutral-500">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="#"
                className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;