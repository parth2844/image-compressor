# Product Context: Image Compressor

## Problem Statement
Online image compression tools require uploading files to remote servers. This creates:
- **Privacy concerns**: Sensitive images exposed to third parties
- **Speed limitations**: Upload/download times for large files
- **Usage restrictions**: Daily limits, file size caps, watermarks on free tiers
- **Offline unavailability**: No internet means no compression

## Solution
A 100% client-side image compressor that processes files entirely in the browser. Files never leave the user's device.

## How It Works

### User Flow
1. User opens the web app (hosted on GitHub Pages)
2. Drags and drops images onto the page (or clicks to browse)
3. Thumbnails appear showing original file sizes
4. User adjusts compression settings:
   - Quality slider (1-100%)
   - Output format (JPEG, WebP)
   - Max dimensions (optional)
5. Clicks "Compress" button
6. Sees compressed sizes and savings percentage
7. Downloads individual files or ZIP archive

### Technical Flow
1. File input triggers JavaScript FileReader
2. Image loaded into Canvas API
3. browser-image-compression library processes the image
4. Compressed blob created in memory
5. URL.createObjectURL generates download link
6. User downloads directly from browser memory

## User Experience Goals

### Primary Goals
- **Zero friction**: No signup, no ads, no waiting
- **Immediate feedback**: Real-time compression preview
- **Trust**: Clear messaging that files stay local
- **Speed**: Compression completes in seconds

### Secondary Goals
- **Education**: Show compression ratio, explain quality tradeoffs
- **Flexibility**: Presets for common use cases (social media, email)
- **Accessibility**: Keyboard navigation, screen reader support

## Competitive Differentiation

| Feature | TinyPNG | Squoosh | Our Tool |
|---------|---------|---------|----------|
| Server upload | Yes | No | No |
| Free tier limits | 500/month | None | None |
| Batch processing | Yes | No | Yes |
| Open source | No | Yes | Yes |
| Offline capable | No | Yes | Yes (future) |

## Key Messaging
- "Your images never leave your browser"
- "No limits. No uploads. No tracking."
- "Fast, private, and free forever."
