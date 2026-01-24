import { useState, useCallback, useEffect } from 'react';
import { generateId } from '../utils/fileHelpers';
import { compressImage } from '../utils/compression';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function useImages() {
  const [images, setImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
        if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
      });
    };
  }, []);

  const addImages = useCallback((files) => {
    const newImages = files.map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      originalSize: file.size,
      preview: URL.createObjectURL(file),
      compressed: null,
      compressedUrl: null,
      compressedSize: null,
      status: 'pending',
      progress: 0,
      error: null,
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        if (image.preview) URL.revokeObjectURL(image.preview);
        if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => {
      if (img.preview) URL.revokeObjectURL(img.preview);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
  }, [images]);

  const compressAll = useCallback(async (settings) => {
    setIsCompressing(true);

    // Mark all as compressing
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        status: 'compressing',
        progress: 0,
        compressed: null,
        compressedUrl: img.compressedUrl ? (URL.revokeObjectURL(img.compressedUrl), null) : null,
        compressedSize: null,
        error: null,
      }))
    );

    // Process each image
    for (const image of images) {
      try {
        // Create progress callback for this specific image
        const onProgress = (progress) => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, progress }
                : img
            )
          );
        };

        const compressed = await compressImage(image.file, {
          ...settings,
          onProgress,
        });
        const compressedUrl = URL.createObjectURL(compressed);

        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  compressed,
                  compressedUrl,
                  compressedSize: compressed.size,
                  status: 'done',
                  progress: 100,
                }
              : img
          )
        );
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: 'error',
                  progress: 0,
                  error: error.message,
                }
              : img
          )
        );
      }
    }

    setIsCompressing(false);
  }, [images]);

  const downloadSingle = useCallback((image) => {
    if (!image.compressed) return;

    const extension = image.compressed.type === 'image/webp' ? 'webp' : 'jpg';
    const baseName = image.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}-compressed.${extension}`;

    saveAs(image.compressed, fileName);
  }, []);

  const downloadZip = useCallback(async () => {
    const compressedImages = images.filter((img) => img.compressed);
    if (compressedImages.length === 0) return;

    const zip = new JSZip();

    compressedImages.forEach((image) => {
      const extension = image.compressed.type === 'image/webp' ? 'webp' : 'jpg';
      const baseName = image.name.replace(/\.[^/.]+$/, '');
      const fileName = `${baseName}-compressed.${extension}`;
      zip.file(fileName, image.compressed);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'compressed-images.zip');
  }, [images]);

  const compressedCount = images.filter((img) => img.status === 'done').length;

  return {
    images,
    isCompressing,
    addImages,
    removeImage,
    clearAll,
    compressAll,
    downloadSingle,
    downloadZip,
    compressedCount,
  };
}
