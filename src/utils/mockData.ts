import { Gemstone, User, Category, GemType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random number in range
const getRandomNumber = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: format(subDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'editor',
    createdAt: format(subDays(new Date(), 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'viewer',
    createdAt: format(subDays(new Date(), 20), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
];

// Categories
const categories: Category[] = [
  'Precious',
  'Semi-Precious',
  'Organic',
  'Synthetic',
  'Other',
];

// Gem types
const gemTypes: GemType[] = [
  'Diamond',
  'Ruby',
  'Sapphire',
  'Emerald',
  'Amethyst',
  'Aquamarine',
  'Citrine',
  'Garnet',
  'Opal',
  'Pearl',
  'Peridot',
  'Tanzanite',
  'Topaz',
  'Tourmaline',
  'Turquoise',
  'Zircon',
  'Other',
];

// Colors
const colors = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Pink',
  'Purple',
  'Orange',
  'Brown',
  'Black',
  'White',
  'Colorless',
  'Multi-colored',
];

// Clarity
const clarities = [
  'FL',
  'IF',
  'VVS1',
  'VVS2',
  'VS1',
  'VS2',
  'SI1',
  'SI2',
  'I1',
  'I2',
  'I3',
];

// Cuts
const cuts = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor',
  'Round',
  'Princess',
  'Cushion',
  'Oval',
  'Emerald',
  'Pear',
  'Marquise',
  'Radiant',
  'Asscher',
  'Heart',
];

// Origins
const origins = [
  'Colombia',
  'Brazil',
  'South Africa',
  'Australia',
  'Canada',
  'Russia',
  'India',
  'Myanmar',
  'Sri Lanka',
  'Madagascar',
  'Tanzania',
  'Zambia',
  'Unknown',
];

// Treatments
const treatments = [
  'None',
  'Heat',
  'Irradiation',
  'Diffusion',
  'Laser Drilling',
  'Fracture Filling',
  'Bleaching',
  'Dyeing',
  'Oiling',
  'Waxing',
  'Unknown',
];

// Sample tags
const sampleTags = [
  'investment',
  'rare',
  'vintage',
  'custom',
  'heirloom',
  'exhibition',
  'sale',
  'new acquisition',
  'anniversary',
  'birthday',
  'gift',
  'holiday',
  'wedding',
  'engagement',
];

// Mock image URLs
const mockImages = [
  'https://images.pexels.com/photos/68740/diamond-gem-cubic-zirconia-jewel-68740.jpeg',
  'https://images.pexels.com/photos/1457824/pexels-photo-1457824.jpeg',
  'https://images.pexels.com/photos/1303087/pexels-photo-1303087.jpeg',
  'https://images.pexels.com/photos/1620678/pexels-photo-1620678.jpeg',
  'https://images.pexels.com/photos/8120176/pexels-photo-8120176.jpeg',
  'https://images.pexels.com/photos/4627480/pexels-photo-4627480.jpeg',
  'https://images.pexels.com/photos/13232459/pexels-photo-13232459.jpeg',
  'https://images.pexels.com/photos/13232571/pexels-photo-13232571.jpeg',
  'https://images.pexels.com/photos/230149/pexels-photo-230149.jpeg',
  'https://images.pexels.com/photos/12522359/pexels-photo-12522359.jpeg',
];

// Generate mock gemstones
export const generateMockGemstones = (count: number): Gemstone[] => {
  const gemstones: Gemstone[] = [];

  for (let i = 0; i < count; i++) {
    const createdAt = format(
      subDays(new Date(), Math.floor(Math.random() * 365)),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    const updatedAt = format(
      subDays(new Date(), Math.floor(Math.random() * 30)),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    
    // Get random user for creation and editing
    const createdByUser = getRandomItem(mockUsers);
    const editedByUser = getRandomItem(mockUsers);
    
    // Get random type and use appropriate category
    const type = getRandomItem(gemTypes);
    let category: Category;
    
    if (['Diamond', 'Ruby', 'Sapphire', 'Emerald'].includes(type)) {
      category = 'Precious';
    } else if (['Pearl'].includes(type)) {
      category = 'Organic';
    } else if (type === 'Other') {
      category = getRandomItem(categories);
    } else {
      category = 'Semi-Precious';
    }

    // Random dimensions
    const length = getRandomNumber(3, 20);
    const width = getRandomNumber(3, 20);
    const height = getRandomNumber(2, 10);

    // Random tags (1-4)
    const numTags = Math.floor(Math.random() * 4) + 1;
    const tags: string[] = [];
    for (let j = 0; j < numTags; j++) {
      const tag = getRandomItem(sampleTags);
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }

    // Random images (1-5)
    const numImages = Math.floor(Math.random() * 4) + 1;
    const images: string[] = [];
    for (let j = 0; j < numImages; j++) {
      const image = getRandomItem(mockImages);
      if (!images.includes(image)) {
        images.push(image);
      }
    }
    
    // Generate a mock QR code URL - in a real app this would be generated
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=gemstone-${uuidv4()}`;

    // Acquisition date sometime in the past
    const acquisitionDate = format(
      subDays(new Date(), Math.floor(Math.random() * 1825)), // Up to 5 years ago
      'yyyy-MM-dd'
    );

    // Create a mock gemstone
    gemstones.push({
      id: uuidv4(),
      name: `${getRandomItem(colors)} ${type}`,
      category,
      type,
      weight: getRandomNumber(0.5, 10),
      dimensions: {
        length,
        width,
        height,
      },
      color: getRandomItem(colors),
      clarity: getRandomItem(clarities),
      cut: getRandomItem(cuts),
      origin: getRandomItem(origins),
      treatment: getRandomItem(treatments),
      certification: Math.random() > 0.5 ? `GIA-${Math.floor(Math.random() * 10000000)}` : '',
      acquisitionDate,
      acquisitionPrice: Math.random() > 0.3 ? getRandomNumber(500, 50000) : undefined,
      estimatedValue: Math.random() > 0.3 ? getRandomNumber(1000, 100000) : undefined,
      seller: Math.random() > 0.5 ? `Seller ${Math.floor(Math.random() * 100)}` : undefined,
      notes: `This is a beautiful ${getRandomItem(colors).toLowerCase()} ${type.toLowerCase()} from ${getRandomItem(origins)}. ${Math.random() > 0.5 ? 'Perfect for a special occasion.' : ''}`,
      tags,
      images,
      video: Math.random() > 0.7 ? 'https://www.w3schools.com/html/mov_bbb.mp4' : undefined,
      qrCode,
      createdAt,
      updatedAt,
      createdBy: createdByUser.id,
      lastEditedBy: editedByUser.id,
      auditTrail: [
        {
          timestamp: createdAt,
          user: createdByUser.id,
          action: 'create',
        },
        {
          timestamp: updatedAt,
          user: editedByUser.id,
          action: 'update',
          changes: {
            notes: {
              before: 'Initial notes',
              after: `This is a beautiful ${getRandomItem(colors).toLowerCase()} ${type.toLowerCase()} from ${getRandomItem(origins)}. ${Math.random() > 0.5 ? 'Perfect for a special occasion.' : ''}`,
            },
          },
        },
      ],
    });
  }

  return gemstones;
};

// Export mock data
export const mockGemstones = generateMockGemstones(20);

// Helper function to get gemstone by ID
export const getGemstoneById = (id: string): Gemstone | undefined => {
  return mockGemstones.find((gemstone) => gemstone.id === id);
};