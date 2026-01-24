import { useState, useEffect } from 'react';
import DropZone from './components/DropZone';
import ImageCard from './components/ImageCard';
import CompressionControls from './components/CompressionControls';
import HowItWorks from './components/HowItWorks';
import FeatureCards from './components/FeatureCards';
import PrivacyNotice from './components/PrivacyNotice';
import { useImages } from './hooks/useImages';

export default function App() {
  const {
    images,
    isCompressing,
    addImages,
    removeImage,
    clearAll,
    compressAll,
    downloadSingle,
    downloadZip,
    compressedCount,
  } = useImages();

  const [settings, setSettings] = useState({
    mode: 'targetSize', // 'targetSize' or 'quality'
    quality: 80,
    targetSizeKB: null, // Target file size in KB
    format: 'jpeg',
    maxWidth: null,
    maxHeight: null,
    lockAspectRatio: true,
    aspectRatio: null, // Will be set from first image
  });

  // Update aspect ratio when first image is added or when images are cleared
  useEffect(() => {
    if (images.length > 0 && !settings.aspectRatio) {
      const img = images[0];
      const image = new Image();
      image.onload = () => {
        setSettings(prev => ({
          ...prev,
          aspectRatio: image.width / image.height
        }));
      };
      image.src = img.preview;
    } else if (images.length === 0 && settings.aspectRatio) {
      setSettings(prev => ({ ...prev, aspectRatio: null }));
    }
  }, [images.length, settings.aspectRatio]);

  const handleCompress = () => {
    compressAll(settings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Image Compressor</h1>
              <p className="text-sm text-gray-500">100% client-side • No uploads • Free forever</p>
            </div>
            {images.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Controls */}
          <div className="lg:col-span-1 space-y-4">
            <DropZone onFilesAdded={addImages} disabled={isCompressing} />
            
            {images.length > 0 && (
              <CompressionControls
                settings={settings}
                onSettingsChange={setSettings}
                onCompress={handleCompress}
                onDownloadAll={downloadZip}
                imageCount={images.length}
                compressedCount={compressedCount}
                isCompressing={isCompressing}
              />
            )}

            {/* How It Works - Collapsible */}
            <HowItWorks />

            {/* Privacy Notice with expandable explanation */}
            <PrivacyNotice />
          </div>

          {/* Right Column - Image Grid or Feature Cards */}
          <div className="lg:col-span-2">
            {images.length === 0 ? (
              <div className="space-y-6">
                <FeatureCards />
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Drop some images to get started!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onRemove={removeImage}
                    onDownload={downloadSingle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <p>
              Open source •{' '}
              <a 
                href="https://github.com/parth2844/image-compressor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on GitHub
              </a>
            </p>
            <p className="text-xs text-gray-400">
              Built with React, Vite & Canvas API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
