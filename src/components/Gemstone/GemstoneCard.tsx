import React from 'react';
import { Link } from 'react-router-dom';
import { Gemstone } from '../../types';
import { Eye, QrCode, Edit, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface GemstoneCardProps {
  gemstone: Gemstone;
}

const GemstoneCard: React.FC<GemstoneCardProps> = ({ gemstone }) => {
  const { id, name, type, category, weight, images, createdAt } = gemstone;
  
  // Get primary image or fallback
  const primaryImage = images.length > 0 
    ? images[0] 
    : 'https://images.pexels.com/photos/68740/diamond-gem-cubic-zirconia-jewel-68740.jpeg';

  return (
    <div className="card group">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={primaryImage} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex space-x-2">
            <Link 
              to={`/gemstone/${id}`}
              className="btn bg-white/90 hover:bg-white text-neutral-800 p-2 rounded-full"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link 
              to={`/gemstone/${id}/edit`}
              className="btn bg-white/90 hover:bg-white text-neutral-800 p-2 rounded-full"
              title="Edit gemstone"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <Link 
              to={`/gemstone/${id}/qr`}
              className="btn bg-white/90 hover:bg-white text-neutral-800 p-2 rounded-full"
              title="View QR code"
            >
              <QrCode className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-semibold text-lg text-neutral-900 truncate">
              {name}
            </h3>
            <div className="flex items-center text-sm text-neutral-500 mt-1">
              <span>{type}</span>
              <span className="mx-1">•</span>
              <span>{category}</span>
            </div>
          </div>
          <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">
            {weight} ct
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            Added {formatDate(createdAt)}
          </div>
          <Link
            to={`/gemstone/${id}`}
            className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center"
          >
            View details
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GemstoneCard;