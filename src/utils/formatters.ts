import { format, parseISO } from 'date-fns';

// Format ISO date string to readable format
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Format ISO date string to include time
export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch (error) {
    return dateString;
  }
};

// Format currency
export const formatCurrency = (value?: number): string => {
  if (value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// Format weight (carats)
export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(2)} ct`;
};

// Format dimensions
export const formatDimensions = (dimensions: { length: number; width: number; height: number }): string => {
  return `${dimensions.length.toFixed(2)} × ${dimensions.width.toFixed(2)} × ${dimensions.height.toFixed(2)} mm`;
};

// Generate caption for sharing
export const generateShareCaption = (gemstone: any): string => {
  const lines = [
    `✨ ${gemstone.name} ✨`,
    `Type: ${gemstone.type}`,
    `Weight: ${formatWeight(gemstone.weight)}`,
    `Cut: ${gemstone.cut}`,
    `Color: ${gemstone.color}`,
    `Origin: ${gemstone.origin}`,
  ];
  
  if (gemstone.estimatedValue) {
    lines.push(`Value: ${formatCurrency(gemstone.estimatedValue)}`);
  }
  
  if (gemstone.tags && gemstone.tags.length > 0) {
    lines.push(`\n#${gemstone.tags.join(' #')}`);
  }
  
  return lines.join('\n');
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};