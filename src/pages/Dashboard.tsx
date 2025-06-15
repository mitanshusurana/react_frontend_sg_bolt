
import { Link } from 'react-router-dom';
import { Diamond, Package, ClipboardList, BarChart3, Search, Plus } from 'lucide-react';
import useGemstones from '../hooks/useGemstones';
import GemstoneCard from '../components/Gemstone/GemstoneCard';
import { Gemstone } from '../types';

const Dashboard = () => {
  const { gemstones = { content: [] }, loading } = useGemstones();
  
  // Show only the 4 most recent gemstones (or fewer if less exist)
  const recentGemstones = (gemstones.content ?? []).slice(0, 4);

  return (
    <div className="container-page">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Welcome to GemTracker</h1>
          <p className="mt-1 text-neutral-500">
            Manage your gemstone inventory efficiently
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/gemstone/new"
            className="btn-primary flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Gemstone</span>
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-primary-100 p-3 mr-4">
            <Diamond className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Gemstones</p>
            <p className="text-2xl font-semibold text-neutral-900">{loading ? '...' : (gemstones.content ?? []).length}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-secondary-100 p-3 mr-4">
            <Package className="h-6 w-6 text-secondary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Categories</p>
            <p className="text-2xl font-semibold text-neutral-900">5</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-accent-100 p-3 mr-4">
            <ClipboardList className="h-6 w-6 text-accent-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Reports</p>
            <p className="text-2xl font-semibold text-neutral-900">3</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-success-100 p-3 mr-4">
            <BarChart3 className="h-6 w-6 text-success-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Analytics</p>
            <p className="text-2xl font-semibold text-neutral-900">12</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/inventory" className="card p-6 hover:bg-primary-50 transition-colors">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-3 mr-4">
              <Search className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Browse Inventory</h3>
              <p className="text-sm text-neutral-500">Search and filter your gemstone collection</p>
            </div>
          </div>
        </Link>
        
        <Link to="/gemstone/new" className="card p-6 hover:bg-secondary-50 transition-colors">
          <div className="flex items-center">
            <div className="rounded-full bg-secondary-100 p-3 mr-4">
              <Plus className="h-6 w-6 text-secondary-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Add Gemstone</h3>
              <p className="text-sm text-neutral-500">Create a new gemstone record</p>
            </div>
          </div>
        </Link>
        
        <Link to="/reports" className="card p-6 hover:bg-accent-50 transition-colors">
          <div className="flex items-center">
            <div className="rounded-full bg-accent-100 p-3 mr-4">
              <ClipboardList className="h-6 w-6 text-accent-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Generate Report</h3>
              <p className="text-sm text-neutral-500">Create inventory reports and exports</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent gemstones */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Gemstones</h2>
          <Link to="/inventory" className="text-sm font-medium text-primary-600 hover:text-primary-800">
            View all
          </Link>
        </div>
        <div className="gem-grid">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="card">
                <div className="aspect-square bg-neutral-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-neutral-200 animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 animate-pulse rounded w-1/2"></div>
                  <div className="mt-3 flex justify-between">
                    <div className="h-3 bg-neutral-200 animate-pulse rounded w-1/3"></div>
                    <div className="h-3 bg-neutral-200 animate-pulse rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : recentGemstones.length > 0 ? (
            recentGemstones.map((gemstone: Gemstone) => (
              <GemstoneCard key={gemstone.id} gemstone={gemstone} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-500">No gemstones found</p>
              <Link to="/gemstone/new" className="btn-primary mt-4 inline-flex">
                Add your first gemstone
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Getting started guide */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="rounded-full bg-primary-100 w-10 h-10 flex items-center justify-center mb-3">
              <span className="font-semibold text-primary-600">1</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-1">Add Gemstones</h3>
            <p className="text-neutral-500 text-sm">
              Start by adding your gemstones to the inventory with details and images.
            </p>
          </div>
          
          <div className="flex flex-col">
            <div className="rounded-full bg-primary-100 w-10 h-10 flex items-center justify-center mb-3">
              <span className="font-semibold text-primary-600">2</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-1">Organize and Tag</h3>
            <p className="text-neutral-500 text-sm">
              Categorize your gemstones and add tags to make them easy to find.
            </p>
          </div>
          
          <div className="flex flex-col">
            <div className="rounded-full bg-primary-100 w-10 h-10 flex items-center justify-center mb-3">
              <span className="font-semibold text-primary-600">3</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-1">Generate QR Codes</h3>
            <p className="text-neutral-500 text-sm">
              Create QR codes for each gemstone for easy identification and tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;