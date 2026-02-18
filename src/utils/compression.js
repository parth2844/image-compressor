import imageCompression from 'browser-image-compression';

/**
 * Get the natural dimensions of an image file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for dimension detection'));
    };
    img.src = url;
  });
}

/**
 * Compress a single image file
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @param {string} options.mode - Compression mode ('targetSize' | 'quality')
 * @param {number} options.quality - Quality 1-100 (used in quality mode)
 * @param {number|null} options.targetSizeKB - Target file size in KB (used in targetSize mode)
 * @param {string} options.format - Output format ('jpeg' | 'webp')
 * @param {number|null} options.maxWidth - Max width in pixels
 * @param {number|null} options.maxHeight - Max height in pixels
 * @param {Function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(file, options = {}) {
  const {
    mode = 'quality',
    quality = 80,
    targetSizeKB = null,
    format = 'jpeg',
    maxWidth = null,
    maxHeight = null,
    onProgress = null,
  } = options;

  // Determine if user explicitly provided dimensions
  const userSetDimensions = !!(maxWidth || maxHeight);

  // Calculate max dimension (use the smaller of maxWidth/maxHeight if both provided)
  let maxWidthOrHeight = undefined;
  if (maxWidth && maxHeight) {
    maxWidthOrHeight = Math.min(maxWidth, maxHeight);
  } else if (maxWidth || maxHeight) {
    maxWidthOrHeight = maxWidth || maxHeight;
  }

  // Build compression options based on mode
  const compressionOptions = {
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    fileType: format === 'webp' ? 'image/webp' : 'image/jpeg',
    onProgress: onProgress ? (progress) => onProgress(Math.round(progress)) : undefined,
  };

  if (mode === 'targetSize' && targetSizeKB) {
    // Target size mode: let library find optimal quality to hit target size
    compressionOptions.maxSizeMB = targetSizeKB / 1024; // Convert KB to MB
    // Don't set initialQuality - library will auto-iterate to find best quality
  } else {
    // Quality mode: use fixed quality, allow larger files
    compressionOptions.maxSizeMB = 50; // Effectively no limit (50MB)
    compressionOptions.initialQuality = quality / 100;
  }

  try {
    let compressedFile = await imageCompression(file, compressionOptions);

    // Progressive dimension reduction fallback for target-size mode
    // Only activates when user didn't set explicit dimensions and quality
    // reduction alone wasn't enough to meet the target size
    if (
      mode === 'targetSize' &&
      targetSizeKB &&
      !userSetDimensions &&
      compressedFile.size > targetSizeKB * 1024
    ) {
      const { width, height } = await getImageDimensions(file);
      let currentMaxDim = Math.max(width, height);
      const minDimension = 50; // Safety floor to avoid tiny images
      const maxRetries = 10;
      let retries = 0;

      while (
        compressedFile.size > targetSizeKB * 1024 &&
        currentMaxDim > minDimension &&
        retries < maxRetries
      ) {
        // Reduce the max dimension by 25% each iteration (preserves aspect ratio)
        currentMaxDim = Math.round(currentMaxDim * 0.75);
        if (currentMaxDim < minDimension) currentMaxDim = minDimension;

        const retryOptions = {
          ...compressionOptions,
          maxWidthOrHeight: currentMaxDim,
          // Suppress progress during retries to avoid confusing progress jumps
          onProgress: undefined,
        };

        compressedFile = await imageCompression(file, retryOptions);
        retries++;
      }

      // Fire final progress after retries complete
      if (onProgress) onProgress(100);
    }

    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    throw new Error(`Failed to compress ${file.name}: ${error.message}`);
  }
}

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @param {Function} onProgress - Progress callback (index, total)
 * @returns {Promise<Array>} Array of {file, compressed, error}
 */
export async function compressImages(files, options = {}, onProgress = null) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (onProgress) {
      onProgress(i, files.length);
    }

    try {
      const compressed = await compressImage(file, options);
      results.push({
        original: file,
        compressed,
        error: null,
      });
    } catch (error) {
      results.push({
        original: file,
        compressed: null,
        error: error.message,
      });
    }
  }

  if (onProgress) {
    onProgress(files.length, files.length);
  }

  return results;
}
