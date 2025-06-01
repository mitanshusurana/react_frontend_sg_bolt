import { useState, useCallback, useEffect } from 'react';
import { Gemstone, FilterParams, PaginationParams } from '../types';
import { mockGemstones } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

// This would be replaced with actual API calls in a real application
export const useGemstones = () => {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [filteredGemstones, setFilteredGemstones] = useState<Gemstone[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterParams>({});

  // Initialize with mock data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGemstones(mockGemstones);
      setFilteredGemstones(mockGemstones);
      setPagination({
        page: 1,
        limit: 12,
        totalItems: mockGemstones.length,
        totalPages: Math.ceil(mockGemstones.length / 12),
      });
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    setLoading(true);
    
    // Apply filters
    let result = [...gemstones];
    
    // Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (gem) =>
          gem.name.toLowerCase().includes(searchLower) ||
          gem.type.toLowerCase().includes(searchLower) ||
          gem.notes.toLowerCase().includes(searchLower) ||
          gem.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Category
    if (filters.category) {
      result = result.filter((gem) => gem.category === filters.category);
    }
    
    // Date range
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      result = result.filter(
        (gem) => new Date(gem.createdAt) >= dateFrom
      );
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999); // End of day
      result = result.filter(
        (gem) => new Date(gem.createdAt) <= dateTo
      );
    }
    
    // Tags
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((gem) =>
        filters.tags!.some((tag) => gem.tags.includes(tag))
      );
    }
    
    // Sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let valueA, valueB;
        
        switch (filters.sortBy) {
          case 'name':
            valueA = a.name;
            valueB = b.name;
            break;
          case 'weight':
            valueA = a.weight;
            valueB = b.weight;
            break;
          case 'value':
            valueA = a.estimatedValue || 0;
            valueB = b.estimatedValue || 0;
            break;
          case 'createdAt':
          default:
            valueA = new Date(a.createdAt).getTime();
            valueB = new Date(b.createdAt).getTime();
            break;
        }
        
        // Apply sort order
        const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
        
        if (valueA < valueB) return -1 * sortOrder;
        if (valueA > valueB) return 1 * sortOrder;
        return 0;
      });
    }
    
    setFilteredGemstones(result);
    setPagination({
      ...pagination,
      page: 1,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / pagination.limit),
    });
    
    setTimeout(() => setLoading(false), 300); // Simulate slight delay for better UX
  }, [filters, gemstones]);

  // Get gemstones for current page
  const getPaginatedGemstones = useCallback(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredGemstones.slice(0, endIndex);
  }, [filteredGemstones, pagination.page, pagination.limit]);

  // Load more gemstones (for infinite scroll)
  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, pagination.totalPages]);

  // Get a single gemstone by ID
  const getGemstone = useCallback(
    (id: string): Gemstone | undefined => {
      return gemstones.find((gem) => gem.id === id);
    },
    [gemstones]
  );

  // Add a new gemstone
  const addGemstone = useCallback(
    (gemstone: Omit<Gemstone, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastEditedBy' | 'auditTrail' | 'qrCode'>): Gemstone => {
      const now = new Date().toISOString();
      const userId = '1'; // Mock user ID
      
      const newGemstone: Gemstone = {
        id: uuidv4(),
        ...gemstone,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=gemstone-${uuidv4()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        lastEditedBy: userId,
        auditTrail: [
          {
            timestamp: now,
            user: userId,
            action: 'create',
          },
        ],
      };
      
      setGemstones((prev) => [newGemstone, ...prev]);
      
      return newGemstone;
    },
    []
  );

  // Update a gemstone
  const updateGemstone = useCallback(
    (id: string, updates: Partial<Gemstone>): Gemstone | undefined => {
      let updatedGemstone: Gemstone | undefined;
      
      setGemstones((prev) => {
        return prev.map((gem) => {
          if (gem.id === id) {
            const now = new Date().toISOString();
            const userId = '1'; // Mock user ID
            
            // Create changes object for audit trail
            const changes: Record<string, { before: any; after: any }> = {};
            Object.keys(updates).forEach((key) => {
              if (key !== 'auditTrail' && key !== 'updatedAt' && key !== 'lastEditedBy') {
                changes[key] = {
                  before: (gem as any)[key],
                  after: (updates as any)[key],
                };
              }
            });
            
            // Create audit event
            const auditEvent = {
              timestamp: now,
              user: userId,
              action: 'update' as const,
              changes,
            };
            
            // Update the gemstone
            updatedGemstone = {
              ...gem,
              ...updates,
              updatedAt: now,
              lastEditedBy: userId,
              auditTrail: [...gem.auditTrail, auditEvent],
            };
            
            return updatedGemstone;
          }
          return gem;
        });
      });
      
      return updatedGemstone;
    },
    []
  );

  // Delete a gemstone
  const deleteGemstone = useCallback(
    (id: string): boolean => {
      let success = false;
      
      setGemstones((prev) => {
        const index = prev.findIndex((gem) => gem.id === id);
        if (index !== -1) {
          success = true;
          const newGemstones = [...prev];
          newGemstones.splice(index, 1);
          return newGemstones;
        }
        return prev;
      });
      
      return success;
    },
    []
  );

  // Get all categories
  const getCategories = useCallback((): string[] => {
    const categories = new Set<string>();
    gemstones.forEach((gem) => categories.add(gem.category));
    return Array.from(categories);
  }, [gemstones]);

  // Get all tags
  const getTags = useCallback((): string[] => {
    const tags = new Set<string>();
    gemstones.forEach((gem) => {
      gem.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [gemstones]);

  return {
    gemstones: getPaginatedGemstones(),
    loading,
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
  };
};

export default useGemstones;