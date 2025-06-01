import React, { useState, useEffect } from 'react';
import { Filter, X, Search, ArrowDownAZ, ArrowUpZA, Calendar } from 'lucide-react';
import { FilterParams } from '../../types';

interface GemstoneFilterProps {
  onFilterChange: (filters: FilterParams) => void;
  categories: string[];
  tags: string[];
}

const GemstoneFilter: React.FC<GemstoneFilterProps> = ({ 
  onFilterChange, 
  categories, 
  tags 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    tags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => {
      const currentTags = prev.tags || [];
      return {
        ...prev,
        tags: currentTags.includes(tag)
          ? currentTags.filter((t) => t !== tag)
          : [...currentTags, tag]
      };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handleSortChange = (sortBy: FilterParams['sortBy']) => {
    setFilters((prev) => {
      // If clicking the same column, toggle order
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        };
      }
      // Otherwise, set the new sort column with default desc order
      return {
        ...prev,
        sortBy,
        sortOrder: 'desc'
      };
    });
  };

  // Apply filters when they change
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [filters, onFilterChange]);

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search bar */}
        <div className="relative w-full md:w-64 lg:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            className="form-input pl-10 w-full"
            placeholder="Search gemstones..."
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              className="form-select pr-10 appearance-none"
            >
              <option value="name">Name</option>
              <option value="createdAt">Date Added</option>
              <option value="weight">Weight</option>
              <option value="value">Value</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {filters.sortOrder === 'asc' ? (
                <ArrowUpZA className="h-4 w-4 text-neutral-400" />
              ) : (
                <ArrowDownAZ className="h-4 w-4 text-neutral-400" />
              )}
            </div>
          </div>
          
          {/* Sort order toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
            className="btn-outline p-2"
          >
            {filters.sortOrder === 'asc' ? (
              <ArrowUpZA className="h-4 w-4" />
            ) : (
              <ArrowDownAZ className="h-4 w-4" />
            )}
          </button>
          
          {/* Filter toggle button */}
          <button
            onClick={toggleFilter}
            className={`btn ${isOpen ? 'bg-primary-600 text-white' : 'btn-outline'} flex items-center`}
          >
            <Filter className="h-4 w-4 mr-1" />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      {/* Expanded filter panel */}
      {isOpen && (
        <div className="bg-white rounded-md shadow-md mt-2 p-4 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-neutral-500 hover:text-neutral-700 flex items-center"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category filter */}
            <div>
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date range filter */}
            <div>
              <label htmlFor="dateFrom" className="form-label flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="dateTo" className="form-label flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          {/* Tags filter */}
          <div className="mt-4">
            <label className="form-label">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`text-sm px-3 py-1 rounded-full ${
                    filters.tags?.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GemstoneFilter;