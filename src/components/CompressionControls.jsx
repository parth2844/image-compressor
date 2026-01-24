import { useState, useEffect } from 'react';

export default function CompressionControls({ 
  settings, 
  onSettingsChange, 
  onCompress, 
  onDownloadAll,
  imageCount,
  compressedCount,
  isCompressing 
}) {
  // Local state for dimension inputs (allows empty string while typing)
  const [widthInput, setWidthInput] = useState(settings.maxWidth || '');
  const [heightInput, setHeightInput] = useState(settings.maxHeight || '');
  const [targetSizeInput, setTargetSizeInput] = useState(settings.targetSizeKB || '');

  // Sync local state when settings change externally
  useEffect(() => {
    setWidthInput(settings.maxWidth || '');
    setHeightInput(settings.maxHeight || '');
    setTargetSizeInput(settings.targetSizeKB || '');
  }, [settings.maxWidth, settings.maxHeight, settings.targetSizeKB]);

  const handleWidthChange = (value) => {
    const numValue = value === '' ? null : parseInt(value);
    setWidthInput(value);
    
    if (settings.lockAspectRatio && numValue && settings.aspectRatio) {
      const newHeight = Math.round(numValue / settings.aspectRatio);
      setHeightInput(newHeight);
      onSettingsChange({ 
        ...settings, 
        maxWidth: numValue,
        maxHeight: newHeight
      });
    } else {
      onSettingsChange({ ...settings, maxWidth: numValue });
    }
  };

  const handleHeightChange = (value) => {
    const numValue = value === '' ? null : parseInt(value);
    setHeightInput(value);
    
    if (settings.lockAspectRatio && numValue && settings.aspectRatio) {
      const newWidth = Math.round(numValue * settings.aspectRatio);
      setWidthInput(newWidth);
      onSettingsChange({ 
        ...settings, 
        maxWidth: newWidth,
        maxHeight: numValue
      });
    } else {
      onSettingsChange({ ...settings, maxHeight: numValue });
    }
  };

  const handleTargetSizeChange = (value) => {
    const numValue = value === '' ? null : parseInt(value);
    setTargetSizeInput(value);
    onSettingsChange({ ...settings, targetSizeKB: numValue });
  };

  const toggleAspectRatioLock = () => {
    onSettingsChange({ 
      ...settings, 
      lockAspectRatio: !settings.lockAspectRatio 
    });
  };

  const clearDimensions = () => {
    setWidthInput('');
    setHeightInput('');
    onSettingsChange({ 
      ...settings, 
      maxWidth: null, 
      maxHeight: null 
    });
  };

  const setMode = (mode) => {
    onSettingsChange({ ...settings, mode });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Mode Toggle */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Compression Mode
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('targetSize')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
              settings.mode === 'targetSize'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Target Size
          </button>
          <button
            onClick={() => setMode('quality')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
              settings.mode === 'quality'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Quality %
          </button>
        </div>
      </div>

      {/* Target Size Input (shown in targetSize mode) */}
      {settings.mode === 'targetSize' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Max File Size
            </label>
            {settings.targetSizeKB && (
              <button
                onClick={() => {
                  setTargetSizeInput('');
                  onSettingsChange({ ...settings, targetSizeKB: null });
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="500"
              value={targetSizeInput}
              onChange={(e) => handleTargetSizeChange(e.target.value)}
              className="w-full py-2 px-3 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              KB
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Quality will auto-adjust to achieve target size while preserving best possible quality
          </p>
        </div>
      )}

      {/* Quality Slider (shown in quality mode) */}
      {settings.mode === 'quality' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="quality" className="text-sm font-medium text-gray-700">
              Quality
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {settings.quality}%
            </span>
          </div>
          <input
            type="range"
            id="quality"
            min="1"
            max="100"
            value={settings.quality}
            onChange={(e) => onSettingsChange({ ...settings, quality: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      {/* Resize Dimensions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Max Dimensions <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          {(settings.maxWidth || settings.maxHeight) && (
            <button
              onClick={clearDimensions}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Width Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="number"
                placeholder="Width"
                value={widthInput}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full py-2 px-3 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                px
              </span>
            </div>
          </div>

          {/* Aspect Ratio Lock Toggle */}
          <button
            onClick={toggleAspectRatioLock}
            className={`p-2 rounded-lg border transition-colors ${
              settings.lockAspectRatio
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-gray-50 border-gray-300 text-gray-400 hover:text-gray-600'
            }`}
            title={settings.lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          >
            {settings.lockAspectRatio ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 011.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 006.364 6.364l3.129-3.129m5.614-5.615l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.501 4.501 0 00-.146 6.187M12 12H5.25" />
              </svg>
            )}
          </button>

          {/* Height Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="number"
                placeholder="Height"
                value={heightInput}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full py-2 px-3 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                px
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-1.5">
          {settings.lockAspectRatio 
            ? 'Aspect ratio locked — dimensions will scale proportionally'
            : 'Aspect ratio unlocked — set dimensions independently'}
        </p>
      </div>

      {/* Format Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Output Format
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onSettingsChange({ ...settings, format: 'jpeg' })}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
              settings.format === 'jpeg'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            JPEG
          </button>
          <button
            onClick={() => onSettingsChange({ ...settings, format: 'webp' })}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
              settings.format === 'webp'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            WebP
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onCompress}
          disabled={imageCount === 0 || isCompressing}
          className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isCompressing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Compressing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
              Compress {imageCount > 0 ? `(${imageCount})` : ''}
            </>
          )}
        </button>

        {compressedCount > 1 && (
          <button
            onClick={onDownloadAll}
            disabled={isCompressing}
            className="py-2.5 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            ZIP
          </button>
        )}
      </div>
    </div>
  );
}
