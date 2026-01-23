/**
 * Format bytes to human readable string
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Calculate compression percentage
 * @param {number} original - Original size in bytes
 * @param {number} compressed - Compressed size in bytes
 * @returns {number} Percentage reduction
 */
export function calculateSavings(original, compressed) {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

/**
 * Generate unique ID
 * @returns {string} UUID
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Check if file is valid image type
 * @param {File} file - File to validate
 * @returns {boolean} Is valid image
 */
export function isValidImageType(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

/**
 * Get file extension from MIME type
 * @param {string} mimeType - MIME type
 * @returns {string} File extension
 */
export function getExtensionFromMime(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return map[mimeType] || 'jpg';
}
