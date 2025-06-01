export interface Gemstone {
  id: string;
  name: string;
  category: string;
  type: string;
  weight: number; // in carats
  dimensions: {
    length: number; // in mm
    width: number; // in mm
    height: number; // in mm
  };
  color: string;
  clarity: string;
  cut: string;
  origin: string;
  treatment: string;
  certification: string;
  acquisitionDate: string;
  acquisitionPrice?: number;
  estimatedValue?: number;
  seller?: string;
  notes: string;
  tags: string[];
  images: string[]; // URLs to images
  video?: string; // URL to video
  qrCode: string; // URL or data for QR code
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastEditedBy: string;
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  timestamp: string;
  user: string;
  action: 'create' | 'update' | 'delete';
  changes?: Record<string, { before: any; after: any }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

export interface MediaUpload {
  file: File;
  progress: number;
  url?: string;
  error?: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'weight' | 'value';
  sortOrder?: 'asc' | 'desc';
}

export interface GemstoneFormValues {
  name: string;
  category: string;
  type: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  color: string;
  clarity: string;
  cut: string;
  origin: string;
  treatment: string;
  certification: string;
  acquisitionDate: string;
  acquisitionPrice?: number;
  estimatedValue?: number;
  seller?: string;
  notes: string;
  tags: string[];
  images: (File | string)[];
  video?: File | string;
}

export interface AnalyticsData {
  totalItems: number;
  itemsByCategory: Record<string, number>;
  itemsByType: Record<string, number>;
  recentAdditions: Gemstone[];
  totalValue: number;
  valueByCategory: Record<string, number>;
}

export type Category = 
  | 'Precious' 
  | 'Semi-Precious' 
  | 'Organic' 
  | 'Synthetic' 
  | 'Other';

export type GemType =
  | 'Diamond'
  | 'Ruby'
  | 'Sapphire'
  | 'Emerald'
  | 'Amethyst'
  | 'Aquamarine'
  | 'Citrine'
  | 'Garnet'
  | 'Opal'
  | 'Pearl'
  | 'Peridot'
  | 'Tanzanite'
  | 'Topaz'
  | 'Tourmaline'
  | 'Turquoise'
  | 'Zircon'
  | 'Other';