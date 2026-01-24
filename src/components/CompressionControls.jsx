export default function CompressionControls({ 
  settings, 
  onSettingsChange, 
  onCompress, 
  onDownloadAll,
  imageCount,
  compressedCount,
  isCompressing 
}) {
  const maxWidthPresets = [
    { label: 'No resize', value: null },
    { label: '1920px (Full HD)', value: 1920 },
    { label: '1280px (HD)', value: 1280 },
    { label: '800px (Web)', value: 800 },
    { label: '400px (Thumbnail)', value: 400 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Quality Slider */}
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

      {/* Max Width Selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Max Width
        </label>
        <select
          value={settings.maxWidth || ''}
          onChange={(e) => onSettingsChange({ 
            ...settings, 
            maxWidth: e.target.value ? parseInt(e.target.value) : null 
          })}
          className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {maxWidthPresets.map((preset) => (
            <option key={preset.label} value={preset.value || ''}>
              {preset.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          {settings.maxWidth 
            ? `Images wider than ${settings.maxWidth}px will be resized`
            : 'Images will keep original dimensions'}
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
