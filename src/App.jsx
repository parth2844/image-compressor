import { useState } from 'react';
import DropZone from './components/DropZone';
import ImageCard from './components/ImageCard';
import CompressionControls from './components/CompressionControls';
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
    quality: 80,
    format: 'jpeg',
  });

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

            {/* Privacy Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">Your images never leave your browser</p>
                  <p className="text-xs text-green-600 mt-0.5">All processing happens locally on your device.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className="lg:col-span-2">
            {images.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No images yet. Drop some images to get started!</p>
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
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          <p>Open source • <a href="https://github.com" className="text-blue-600 hover:underline">View on GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}
