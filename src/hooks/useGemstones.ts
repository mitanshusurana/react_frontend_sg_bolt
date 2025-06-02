import { useState, useCallback, useEffect } from 'react';
import { Gemstone, FilterParams, PaginationParams } from '../types';
import { gemstoneService } from '../services/gemstoneService';
import toast from 'react-hot-toast';

export const useGemstones = () => {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterParams>({});

  // Fetch gemstones
  const fetchGemstones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      
      const response = await gemstoneService.getGemstones(params);
      
      setGemstones(response.data);
      setPagination({
        ...pagination,
        totalItems: response.total,
        totalPages: Math.ceil(response.total / pagination.limit),
      });
    } catch (err) {
      setError('Failed to fetch gemstones');
      toast.error('Failed to fetch gemstones');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Initial fetch
  useEffect(() => {
    fetchGemstones();
  }, [fetchGemstones]);

  // Get a single gemstone
  const getGemstone = useCallback(async (id: string) => {
    try {
      const gemstone = await gemstoneService.getGemstone(id);
      return gemstone;
    } catch (err) {
      toast.error('Failed to fetch gemstone details');
      return undefined;
    }
  }, []);

  // Add a new gemstone
  const addGemstone = useCallback(async (data: Omit<Gemstone, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newGemstone = await gemstoneService.createGemstone(data);
      setGemstones((prev) => [newGemstone, ...prev]);
      return newGemstone;
    } catch (err) {
      toast.error('Failed to add gemstone');
      throw err;
    }
  }, []);

  // Update a gemstone
  const updateGemstone = useCallback(async (id: string, updates: Partial<Gemstone>) => {
    try {
      const updatedGemstone = await gemstoneService.updateGemstone(id, updates);
      setGemstones((prev) =>
        prev.map((gem) => (gem.id === id ? updatedGemstone : gem))
      );
      return updatedGemstone;
    } catch (err) {
      toast.error('Failed to update gemstone');
      throw err;
    }
  }, []);

  // Delete a gemstone
  const deleteGemstone = useCallback(async (id: string) => {
    try {
      await gemstoneService.deleteGemstone(id);
      setGemstones((prev) => prev.filter((gem) => gem.id !== id));
      return true;
    } catch (err) {
      toast.error('Failed to delete gemstone');
      return false;
    }
  }, []);

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
    gemstones.forEach((gem) => categories.add(gem.category));
    return Array.from(categories);
  }, [gemstones]);

  // Get all tags
  const getTags = useCallback(() => {
    const tags = new Set<string>();
    gemstones.forEach((gem) => {
      gem.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [gemstones]);

  return {
    gemstones,
    loading,
    error,
    pagination,
    hasMore: pagination.page < pagination.totalPages,
    loadMore,
    filters,
    setFilters,
    getGemstone,
    addGemstone,
    updateGemstone,
    deleteGemstone,
    getCategories,
    getTags,
    refresh: fetchGemstones,
  };
};

export default useGemstones;