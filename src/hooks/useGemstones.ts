import { useState, useCallback, useEffect, useRef } from 'react';
import { Gemstone, FilterParams, PaginationParams, PaginatedGemstones } from '../types';
import { gemstoneService } from '../services/gemstoneService';
import toast from 'react-hot-toast';
import { useGemstoneCacheStore } from '../store/GemstoneCacheStore';

const DEBOUNCE_DELAY = 400;

export const useGemstones = () => {
  const [gemstones, setGemstones] = useState<PaginatedGemstones>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterParams>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    gemstoneCache,
    singleGemstoneCache,
    setGemstoneCache,
    setSingleGemstoneCache,
    clearCaches,
  } = useGemstoneCacheStore();

  // Helper to get cache key
  const getCacheKey = useCallback(
    () => JSON.stringify({ page: pagination.page, limit: pagination.limit, ...filters }),
    [pagination.page, pagination.limit, filters]
  );

  // Fetch gemstones with global cache
  const fetchGemstones = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cacheKey = getCacheKey();
    const cached = gemstoneCache[cacheKey];
    if (cached) {
      setGemstones(cached);
      setLoading(false);
      return;
    }
    try {
      const params = { page: pagination.page, limit: pagination.limit, ...filters };
      const response = await gemstoneService.getGemstones(params);

      const result = response || {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 12,
        number: 1,
      };
      setGemstoneCache(cacheKey, result);
      setGemstones(result);
      setPagination(prev => ({
        ...prev,
        totalItems: response.total,
        totalPages: Math.ceil(response.total / prev.limit),
      }));
    } catch (err) {
      setError('Failed to fetch gemstones');
      toast.error('Failed to fetch gemstones');
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, pagination.page, pagination.limit, filters, setGemstoneCache]);

  // Debounce fetch on filters or pagination change
  useEffect(() => {
    const cacheKey = getCacheKey();
    const cached = gemstoneCache[cacheKey];
    if (cached) {
      setGemstones(cached);
      setLoading(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchGemstones();
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // Only depend on cacheKey, not the whole gemstoneCache object
  }, [getCacheKey()]);

  // Invalidate cache on add/update/delete
  const clearCache = () => {
    Object.keys(gemstoneCache).forEach(key => delete gemstoneCache[key]);
  };

  // Get a single gemstone with cache
  const getGemstone = useCallback(async (id: string) => {
    if (singleGemstoneCache[id]) {
      return singleGemstoneCache[id];
    }
    try {
      const gemstone = await gemstoneService.getGemstone(id);
      if (gemstone) {
        setSingleGemstoneCache(id, gemstone);
      }
      return gemstone;
    } catch (err) {
      toast.error('Failed to fetch gemstone details');
      return undefined;
    }
  }, [singleGemstoneCache, setSingleGemstoneCache]);

  // Invalidate single gemstone cache on add/update/delete
  const clearSingleGemstoneCache = () => {
    Object.keys(singleGemstoneCache).forEach(key => delete singleGemstoneCache[key]);
  };

  // Add a new gemstone
  const addGemstone = useCallback(async (data: Omit<Gemstone, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newGemstone = await gemstoneService.createGemstone(data);
      clearCache();
      clearSingleGemstoneCache();
      fetchGemstones();
      return newGemstone;
    } catch (err) {
      toast.error('Failed to add gemstone');
      throw err;
    }
  }, [fetchGemstones]);

  // Update a gemstone
  const updateGemstone = useCallback(async (id: string, updates: Partial<Gemstone>) => {
    try {
      const updatedGemstone = await gemstoneService.updateGemstone(id, updates);
      clearCache();
      clearSingleGemstoneCache();
      fetchGemstones();
      return updatedGemstone;
    } catch (err) {
      toast.error('Failed to update gemstone');
      throw err;
    }
  }, [fetchGemstones]);

  // Delete a gemstone
  const deleteGemstone = useCallback(async (id: string) => {
    try {
      await gemstoneService.deleteGemstone(id);
      clearCache();
      clearSingleGemstoneCache();
      fetchGemstones();
      return true;
    } catch (err) {
      toast.error('Failed to delete gemstone');
      return false;
    }
  }, [fetchGemstones]);

  // Load more gemstones
  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, pagination.totalPages]);

  // Get all categories
  const getCategories = useCallback(() => {
    const categories = new Set<string>();
    (gemstones.content ?? []).forEach((gem: { category: string; }) => categories.add(gem.category));
    return Array.from(categories);
  }, [gemstones]);

  // Get all tags
  const getTags = useCallback(() => {
    const tags = new Set<string>();
    (gemstones.content ?? []).forEach((gem: { tags: any; }) => {
      (gem.tags || []).forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  }, [gemstones]);

  return {
    gemstones,
    loading,
    error,
    pagination,
    hasMore: pagination.page < pagination.totalPages,
    loadMore: () => setPagination(prev => ({ ...prev, page: prev.page + 1 })),
    filters,
    setFilters,
    addGemstone,
    updateGemstone,
    deleteGemstone,
    getGemstone,
    getCategories: useCallback(() => {
      const categories = new Set<string>();
      (gemstones.content ?? []).forEach((gem: { category: string; }) => categories.add(gem.category));
      return Array.from(categories);
    }, [gemstones]),
    getTags: useCallback(() => {
      const tags = new Set<string>();
      (gemstones.content ?? []).forEach((gem: { tags: any; }) => {
        (gem.tags || []).forEach((tag: string) => tags.add(tag));
      });
      return Array.from(tags);
    }, [gemstones]),
    refresh: fetchGemstones,
  };
};

export default useGemstones;