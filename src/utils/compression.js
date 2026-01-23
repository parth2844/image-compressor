import imageCompression from 'browser-image-compression';

/**
 * Compress a single image file
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.quality - Quality 1-100
 * @param {string} options.format - Output format ('jpeg' | 'webp')
 * @param {number|null} options.maxWidth - Max width in pixels
 * @param {number|null} options.maxHeight - Max height in pixels
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(file, options = {}) {
  const {
    quality = 80,
    format = 'jpeg',
    maxWidth = null,
    maxHeight = null,
  } = options;

  // Calculate max dimension (use the smaller of maxWidth/maxHeight if both provided)
  let maxWidthOrHeight = undefined;
  if (maxWidth && maxHeight) {
    maxWidthOrHeight = Math.min(maxWidth, maxHeight);
  } else if (maxWidth || maxHeight) {
    maxWidthOrHeight = maxWidth || maxHeight;
  }

  const compressionOptions = {
    maxSizeMB: 10, // Allow up to 10MB (we control quality instead)
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    fileType: format === 'webp' ? 'image/webp' : 'image/jpeg',
    initialQuality: quality / 100,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
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
