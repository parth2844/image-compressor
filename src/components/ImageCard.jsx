import { useMemo } from 'react';
import { formatFileSize, calculateSavings } from '../utils/fileHelpers';

export default function ImageCard({ image, onRemove, onDownload }) {
  const savings = useMemo(() => {
    if (image.compressedSize) {
      return calculateSavings(image.originalSize, image.compressedSize);
    }
    return null;
  }, [image.originalSize, image.compressedSize]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image Preview */}
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={image.preview}
          alt={image.name}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        {image.status === 'compressing' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
        )}
        
        {image.status === 'error' && (
          <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Error</span>
          </div>
        )}
        
        {/* Remove Button */}
        <button
          onClick={() => onRemove(image.id)}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
          title="Remove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Info */}
      <div className="p-3 space-y-2">
        {/* Filename */}
        <p className="text-sm font-medium text-gray-800 truncate" title={image.name}>
          {image.name}
        </p>
        
        {/* Size Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {formatFileSize(image.originalSize)}
          </span>
          
          {image.compressedSize && (
            <>
              <span className="text-gray-400">→</span>
              <span className="text-green-600 font-medium">
                {formatFileSize(image.compressedSize)}
              </span>
            </>
          )}
        </div>
        
        {/* Savings Badge */}
        {savings !== null && savings > 0 && (
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              -{savings}% smaller
            </span>
            
            {/* Download Button */}
            {image.compressed && (
              <button
                onClick={() => onDownload(image)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Download
              </button>
            )}
          </div>
        )}
        
        {/* Error Message */}
        {image.error && (
          <p className="text-xs text-red-600">{image.error}</p>
        )}
      </div>
    </div>
  );
}
