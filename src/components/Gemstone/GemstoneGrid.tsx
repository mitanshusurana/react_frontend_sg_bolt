import React from 'react';
import { Gemstone } from '../../types';
import GemstoneCard from './GemstoneCard';
import { useInView } from 'react-intersection-observer';

interface GemstoneGridProps {
  gemstones: Gemstone[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const GemstoneGrid: React.FC<GemstoneGridProps> = ({ 
  gemstones = [], 
  loading = false, 
  onLoadMore,
  hasMore = false
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });

  // Call onLoadMore when the sentinel comes into view
  React.useEffect(() => {
    if (inView && hasMore && onLoadMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore, loading]);

  if (gemstones.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="mt-2 text-lg font-medium text-neutral-900">No gemstones found</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gem-grid animate-fade-in">
      {(Array.isArray(gemstones) ? gemstones : []).map((gemstone) => (
        <GemstoneCard key={gemstone.id} gemstone={gemstone} />
      ))}
      
      {/* Loading skeleton cards */}
      {loading && 
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
      }
      
      {/* Sentinel element for infinite scroll */}
      {hasMore && <div ref={ref} className="h-10 w-full"></div>}
    </div>
  );
};

export default GemstoneGrid;