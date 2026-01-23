# Project Brief: Image Compressor

## Overview
A client-side image compression utility hosted on GitHub Pages. All processing happens in the browser—no server uploads required.

## Core Requirements

### Functional Requirements
1. **Image Upload**: Drag-and-drop or file picker for single/multiple images
2. **Compression**: Adjustable quality (1-100%) using browser-image-compression library
3. **Format Support**: JPEG, PNG, WebP input; JPEG/WebP output options
4. **Resize**: Scale by percentage or set max dimensions
5. **Batch Processing**: Handle multiple images simultaneously
6. **Download**: Individual files or ZIP archive for batch
7. **Privacy**: 100% client-side, no data leaves the browser

### Non-Functional Requirements
1. **Hosting**: GitHub Pages (static files only)
2. **Performance**: Non-blocking compression via Web Workers
3. **Responsive**: Works on desktop and mobile browsers
4. **Offline**: PWA capability for offline use (future enhancement)

## Target Users
- Developers needing quick image optimization
- Content creators preparing images for web/social media
- Privacy-conscious users avoiding upload-based tools

## Success Metrics
- Functional prototype with core compression features
- Clean, intuitive UI
- GitHub Pages deployment working
- Sub-second compression for typical images (<5MB)

## Constraints
- No backend/server-side code
- Free hosting only (GitHub Pages)
- Must work in modern browsers (Chrome, Firefox, Safari, Edge)

## Out of Scope (v1)
- User accounts/authentication
- Cloud storage integration
- Advanced editing (crop, rotate, filters)
