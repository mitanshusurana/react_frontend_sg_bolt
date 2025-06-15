import { create } from 'zustand';
import { PaginatedGemstones, Gemstone } from '../types';

interface GemstoneCacheStore {
  gemstoneCache: Record<string, PaginatedGemstones>;
  singleGemstoneCache: Record<string, Gemstone>;
  setGemstoneCache: (key: string, value: PaginatedGemstones) => void;
  setSingleGemstoneCache: (id: string, value: Gemstone) => void;
  clearCaches: () => void;
}

export const useGemstoneCacheStore = create<GemstoneCacheStore>((set) => ({
  gemstoneCache: {},
  singleGemstoneCache: {},
  setGemstoneCache: (key, value) =>
    set((state) => ({
      gemstoneCache: { ...state.gemstoneCache, [key]: value },
    })),
  setSingleGemstoneCache: (id, value) =>
    set((state) => ({
      singleGemstoneCache: { ...state.singleGemstoneCache, [id]: value },
    })),
  clearCaches: () =>
    set(() => ({
      gemstoneCache: {},
      singleGemstoneCache: {},
    })),
}));