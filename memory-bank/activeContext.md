# Active Context: Image Compressor

## Current Focus
Fixed target-size-only compression bug — images now reliably hit the user's target file size even without explicit dimension settings.

## Recent Changes (Session 2 - 2026-02-17)
- Fixed bug: target-size compression without dimensions failed to meet size target
- Added `getImageDimensions()` helper to read natural image dimensions
- Added progressive dimension reduction fallback in `compressImage()`:
  - First attempts quality-only compression
  - If result still exceeds target and no user dimensions were set, progressively reduces `maxWidthOrHeight` by 25% per iteration
  - Preserves aspect ratio (uses `maxWidthOrHeight` which scales proportionally)
  - Safety floor at 50px, max 10 retries
- Change is entirely in `src/utils/compression.js`

## Previous Changes (Session 1 - 2025-01-23)
- Built complete prototype from scratch
- Created all core components:
  - `DropZone.jsx` - Drag-and-drop file upload
  - `ImageCard.jsx` - Individual image preview with stats
  - `CompressionControls.jsx` - Quality slider, format selection
  - `HowItWorks.jsx` - Collapsible explanation section
  - `FeatureCards.jsx` - Empty state feature highlights
  - `PrivacyNotice.jsx` - Expandable privacy explanation
- Custom hook `useImages.js` manages all image state
- Utils for compression and file helpers
- Pushed to GitHub: https://github.com/parth2844/image-compressor

## Next Steps
1. Deploy to GitHub Pages (npm run deploy)
2. Add max dimension settings (resize feature)
3. Add progress indicators per image during compression
4. Test on mobile devices
5. Add README with screenshots

## Active Decisions

### Decided
- **Framework**: React 18 with Vite (fast DX, GitHub Pages compatible)
- **Styling**: Tailwind CSS (rapid prototyping, no custom CSS)
- **Compression**: browser-image-compression (Web Worker support)
- **State**: useState/useCallback in custom hook (kept simple, works well)
- **Privacy messaging**: Expandable explanation with non-technical language

### Open Questions
- Should we add dark mode toggle?
- Should we add presets (Social Media, Email, Thumbnail)?
- Should we add image comparison slider (before/after)?

## Important Patterns

### File Handling
- Use `URL.createObjectURL()` for image previews
- Clean up object URLs on component unmount to prevent memory leaks
- Validate file types before processing

### Component Communication
- App.jsx holds settings state
- useImages hook manages image collection
- Components receive callbacks for actions

### UI Patterns
- Collapsible sections for secondary info (HowItWorks, PrivacyNotice)
- Feature cards shown only in empty state
- Green styling for privacy/trust messaging

## Current Session Notes
- All core features implemented
- .clinerules file created for future sessions
- Memory Bank updated to current state
