import { api } from '../config/api';
import { Gemstone } from '../types';

export const gemstoneService = {
  // Get all gemstones with pagination and filters
  async getGemstones(params?: Record<string, any>) {
    // params can include page, size, sort, filters, etc.
    const response = await api.get('', { params });
    return response.data; // return the full paginated response
  },

  // Get a single gemstone by ID
  async getGemstone(id: string) {
    const response = await api.get(`${id}`);
    return response.data;
  },

  // Create a new gemstone
  async createGemstone(data: Omit<Gemstone, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('', data);
    return response.data;
  },

  // Update an existing gemstone
  async updateGemstone(_id: string, data: Partial<Gemstone>) {
    const response = await api.put(``, data);
    return response.data;
  },

  // Delete a gemstone
  async deleteGemstone(id: string) {
    const response = await api.delete(`${id}`);
    return response.data;
  },

  // Upload media files
 
};