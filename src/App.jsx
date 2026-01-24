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
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/parth-shah97/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://github.com/parth2844"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                title="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="mailto:parth2844@gmail.com"
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </a>
            </div>
            
            {/* Created by text */}
            <p className="text-sm text-gray-500">
              Created by{' '}
              <a
                href="https://parth2844.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Parth Shah
              </a>
              {' '}• Open source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
