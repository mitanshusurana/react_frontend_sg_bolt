import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Tag, 
  QrCode, 
  Calendar, 
  Clipboard, 

  Info,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import useGemstones from '../hooks/useGemstones';
import GemstoneGallery from '../components/Gemstone/GemstoneGallery';
import { formatDate, formatDateTime, formatCurrency, formatWeight, formatDimensions, generateShareCaption } from '../utils/formatters';
import toast from 'react-hot-toast';

const GemstoneDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGemstone, deleteGemstone } = useGemstones();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  
  if (!id) {
    return <div>Invalid gemstone ID</div>;
  }
  
  const [gemstone, setGemstone] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getGemstone(id)
      .then((data: any) => {
        if (isMounted) {
          setGemstone(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setGemstone(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id, getGemstone]);

  if (loading) {
    return (
      <div className="container-page flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!gemstone) {
    return (
      <div className="container-page flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Gemstone Not Found</h1>
          <p className="text-neutral-500 mb-6">
            The gemstone you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/inventory" className="btn-primary">
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }
  
  const handleDelete = async () => {
    const success = await deleteGemstone(id);
    
    if (success) {
      toast.success('Gemstone deleted successfully');
      navigate('/inventory');
    } else {
      toast.error('Failed to delete gemstone');
    }
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  const handleShare = (platform: 'whatsapp' | 'instagram' | 'email') => {
    const caption = generateShareCaption(gemstone);
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, '_blank');
        break;
      case 'instagram':
        // For Instagram, we can only copy the caption to clipboard
        handleCopyToClipboard(caption);
        toast.success('Instagram caption copied to clipboard. Open Instagram to paste and upload photos.');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(gemstone.name)}&body=${encodeURIComponent(caption)}`, '_blank');
        break;
    }
  };

  return (
    <div className="container-page">
      {/* Back button */}
      <Link 
        to="/inventory" 
        className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Inventory
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">{gemstone.name}</h1>
        
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Link 
            to={`/gemstone/${id}/qr`}
            className="btn-outline flex items-center"
          >
            <QrCode className="h-4 w-4 mr-1" />
            QR Code
          </Link>
          <Link 
            to={`/gemstone/${id}/edit`}
            className="btn-primary flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
          <button 
            className="btn-outline border-error-300 text-error-700 hover:bg-error-50 flex items-center"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Media */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <GemstoneGallery 
              images={gemstone.images}
              video={gemstone.video}
              name={gemstone.name}
            />
          </div>
          
          {/* Tags */}
          <div className="mt-6">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 text-neutral-500 mr-2" />
              <h3 className="text-lg font-medium text-neutral-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(gemstone.tags as Array<any>)
                .filter((tag) => typeof tag === 'string' || typeof tag === 'number')
                .map((tag: string | number) => (
                  <span 
                    key={tag} 
                    className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              {(gemstone.tags.filter((tag: any) => typeof tag === 'string' || typeof tag === 'number').length === 0) && (
                <span className="text-neutral-500 text-sm">No tags</span>
              )}
            </div>
          </div>
          
          {/* Notes */}
          <div className="card p-6 mt-6">
            <div className="flex items-center mb-2">
              <Clipboard className="h-4 w-4 text-neutral-500 mr-2" />
              <h3 className="text-lg font-medium text-neutral-900">Notes</h3>
            </div>
            <p className="text-neutral-700 whitespace-pre-wrap">
              {gemstone.notes || 'No notes available.'}
            </p>
          </div>
          
          {/* Audit Trail */}
          <div className="mt-6">
            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="flex items-center text-neutral-600 hover:text-neutral-900 mb-2"
            >
              <Clock className="h-4 w-4 mr-2" />
              <h3 className="text-lg font-medium">Audit Trail</h3>
              <span className="ml-2 bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full text-xs">
                {gemstone.auditTrail.length}
              </span>
            </button>
            
            {showAuditTrail && (
              <div className="card p-4 mt-2 max-h-96 overflow-y-auto">
                {gemstone.auditTrail.map((event: { action: string; timestamp: string; changes: { [s: string]: { before: any; after: any } }; }, index: React.Key | null | undefined) => (
                  <div 
                    key={index} 
                    className="mb-4 pb-4 border-b border-neutral-200 last:border-0 last:mb-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <span className={`
                          w-2 h-2 rounded-full mr-2 
                          ${event.action === 'create' ? 'bg-success-500' : ''}
                          ${event.action === 'update' ? 'bg-primary-500' : ''}
                          ${event.action === 'delete' ? 'bg-error-500' : ''}
                        `}></span>
                        <span className="font-medium text-neutral-800 capitalize">
                          {event.action}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-500">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    
                    {event.changes && Object.keys(event.changes).length > 0 && (
                      <div className="mt-2 pl-4 text-sm">
                        <div className="text-neutral-500 mb-1">Changes:</div>
                        {Object.entries(event.changes).map(([field, value]) => {
                          const { before, after } = value as { before: any; after: any };
                          return (
                            <div key={field} className="ml-2 mb-1">
                              <span className="font-medium text-neutral-700">{field}: </span>
                              <span className="text-error-600 line-through">{before || 'empty'}</span>
                              <span className="mx-1">→</span>
                              <span className="text-success-600">{after || 'empty'}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Details and actions */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            {/* Main details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Gemstone Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Category:</span>
                  <span className="font-medium text-neutral-900">{gemstone.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Type:</span>
                  <span className="font-medium text-neutral-900">{gemstone.type}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Weight:</span>
                  <span className="font-medium text-neutral-900">{formatWeight(gemstone.weight)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Dimensions:</span>
                  <span className="font-medium text-neutral-900">{formatDimensions(gemstone.dimensions)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Color:</span>
                  <span className="font-medium text-neutral-900">{gemstone.color}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Clarity:</span>
                  <span className="font-medium text-neutral-900">{gemstone.clarity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Cut:</span>
                  <span className="font-medium text-neutral-900">{gemstone.cut}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Origin:</span>
                  <span className="font-medium text-neutral-900">{gemstone.origin}</span>
                </div>
                
                {gemstone.treatment && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Treatment:</span>
                    <span className="font-medium text-neutral-900">{gemstone.treatment}</span>
                  </div>
                )}
                
                {gemstone.certification && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Certification:</span>
                    <span className="font-medium text-neutral-900">{gemstone.certification}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Acquisition details */}
            <div className="mb-6 border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Acquisition Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Date:</span>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-neutral-400" />
                    <span className="font-medium text-neutral-900">{gemstone.acquisitionDate}</span>
                  </div>
                </div>
                
                {gemstone.acquisitionPrice !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Purchase Price:</span>
                    <span className="font-medium text-neutral-900">{formatCurrency(gemstone.acquisitionPrice)}</span>
                  </div>
                )}
                
                {gemstone.estimatedValue !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Estimated Value:</span>
                    <span className="font-medium text-neutral-900">{formatCurrency(gemstone.estimatedValue)}</span>
                  </div>
                )}
                
                {gemstone.seller && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Seller:</span>
                    <span className="font-medium text-neutral-900">{gemstone.seller}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Share section */}
            <div className="mb-6 border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Share</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="btn-outline flex flex-col items-center justify-center p-4 h-auto"
                >
                  <svg className="h-5 w-5 text-[#25D366] mb-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-xs">WhatsApp</span>
                </button>
                
                <button
                  onClick={() => handleShare('instagram')}
                  className="btn-outline flex flex-col items-center justify-center p-4 h-auto"
                >
                  <svg className="h-5 w-5 text-[#E1306C] mb-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span className="text-xs">Instagram</span>
                </button>
                
                <button
                  onClick={() => handleShare('email')}
                  className="btn-outline flex flex-col items-center justify-center p-4 h-auto"
                >
                  <svg className="h-5 w-5 text-neutral-600 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="text-xs">Email</span>
                </button>
              </div>
              
              <button
                onClick={() => handleCopyToClipboard(window.location.href)}
                className="btn-outline w-full mt-3 flex items-center justify-center"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Copy Link
              </button>
            </div>
            
            {/* Metadata */}
            <div className="text-xs text-neutral-500 border-t border-neutral-200 pt-4">
              <div className="flex items-center mb-1">
                <Info className="h-3 w-3 mr-1" />
                <span>Created: {formatDate(gemstone.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Info className="h-3 w-3 mr-1" />
                <span>Last updated: {formatDate(gemstone.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Delete Gemstone</h3>
            <p className="text-neutral-600 mb-4">
              Are you sure you want to delete "{gemstone.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn-outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-error-600 text-white hover:bg-error-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GemstoneDetailPage;