import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useGemstones from '../hooks/useGemstones';
import GemstoneGrid from '../components/Gemstone/GemstoneGrid';
import GemstoneFilter from '../components/Gemstone/GemstoneFilter';
import { FilterParams } from '../types';

const InventoryPage: React.FC = () => {
  const { 
    gemstones, 
    loading, 
    hasMore, 
    loadMore, 
    setFilters,
    getCategories,
    getTags
  } = useGemstones();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  
  // Load categories and tags
  useEffect(() => {
    setCategories(getCategories());
    setTags(getTags());
  }, [getCategories, getTags]);
  
  const handleFilterChange = (filters: FilterParams) => {
    setFilters(filters);
  };

  return (
    <div className="container-page">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Gemstone Inventory</h1>
          <p className="mt-1 text-neutral-500">
            Browse, search, and manage your gemstone collection
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
      
      {/* Filters */}
      <GemstoneFilter 
        onFilterChange={handleFilterChange}
        categories={categories}
        tags={tags}
      />
      
      {/* Grid view */}
      <GemstoneGrid 
        gemstones={gemstones}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
};

export default InventoryPage;