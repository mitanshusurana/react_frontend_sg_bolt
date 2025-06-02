import { api } from '../config/api';
import { Gemstone, GemstoneFormValues } from '../types';

export const gemstoneService = {
  // Get all gemstones with optional filters
   // ...existing code...
    // Get all gemstones with optional filters
    async getGemstones(params?: Record<string, any>) {
      const response = await api.get('', { params });
      return response.data;
    },
  // ...existing code...

  // Get a single gemstone by ID
  async getGemstone(id: string) {
    const response = await api.get(`${id}`);
    return response.data;
  },

  // Create a new gemstone
  async createGemstone(data: GemstoneFormValues) {
    const response = await api.post('',data);
    return response.data;
  },

  // Update an existing gemstone
  async updateGemstone(id: string, data: Partial<GemstoneFormValues>) {
    const response = await api.put(`${id}`, data);
    return response.data;
  },

  // Delete a gemstone
  async deleteGemstone(id: string) {
    const response = await api.delete(`${id}`);
    return response.data;
  },

  // Upload media files
 
};