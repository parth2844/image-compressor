# System Patterns: Image Compressor

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                               │
│  ┌─────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │  DropZone   │  │ CompressionPanel │  │  ImageGrid     │  │
│  │  Component  │  │    Component     │  │  Component     │  │
│  └─────────────┘  └──────────────────┘  └────────────────┘  │
│         │                  │                    │            │
│         └──────────────────┼────────────────────┘            │
│                            ▼                                 │
│                 ┌──────────────────┐                        │
│                 │   useImages()    │ (Custom Hook)          │
│                 │   State Manager  │                        │
│                 └──────────────────┘                        │
│                            │                                 │
│                            ▼                                 │
│                 ┌──────────────────┐                        │
│                 │ Compression      │ (Web Worker)           │
│                 │ Service          │                        │
│                 └──────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### App.jsx
Root component managing global state and layout.

### DropZone
- Handles drag-and-drop events
- File input fallback for click-to-browse
- Validates file types (image/*)
- Emits files to parent

### CompressionControls
- Quality slider (1-100)
- Format selector (JPEG/WebP)
- "Compress All" button
- "Download ZIP" button (shows when multiple compressed)

### ImageCard
- Individual image preview card
- Shows: thumbnail, filename, original/compressed size
- Savings percentage badge
- Individual download button
- Remove button

### HowItWorks (Collapsible)
- Click to expand/collapse
- 3-step process explanation
- Technical note at bottom
- Pattern: starts collapsed, user-initiated reveal

### FeatureCards (Empty State Only)
- Displays when no images uploaded
- 3 cards: Private, Fast, No Limits
- Disappears when images added
- Pattern: empty state value proposition

### PrivacyNotice (Expandable)
- Always visible in sidebar
- "Learn why" expands detailed explanation
- Visual comparison (other tools vs this tool)
- Non-technical analogies (Word vs Google Docs)
- Pattern: progressive disclosure

## State Management

### Image State Structure
```javascript
{
  images: [
    {
      id: string,           // UUID
      file: File,           // Original file object
      name: string,         // Filename
      originalSize: number, // Bytes
      preview: string,      // Object URL for thumbnail
      compressed: Blob | null,
      compressedSize: number | null,
      status: 'pending' | 'compressing' | 'done' | 'error',
      error: string | null
    }
  ],
  settings: {
    quality: number,        // 1-100
    format: 'jpeg' | 'webp',
    maxWidth: number | null,
    maxHeight: number | null
  }
}
```

### Custom Hook: useImages
Encapsulates all image-related state and operations:
- `addImages(files)`: Add new files to state
- `removeImage(id)`: Remove single image
- `clearAll()`: Reset state
- `compressAll(settings)`: Trigger compression
- `downloadSingle(id)`: Download one image
- `downloadZip()`: Package all as ZIP

## Compression Flow

```
1. User drops files
        │
        ▼
2. Files validated (type, size)
        │
        ▼
3. Preview URLs generated
        │
        ▼
4. Images added to state (status: pending)
        │
        ▼
5. User adjusts settings
        │
        ▼
6. User clicks "Compress"
        │
        ▼
7. For each image (status: compressing):
   ├── Create compression options
   ├── Call browser-image-compression
   ├── Store result blob
   └── Update state (status: done)
        │
        ▼
8. UI shows compressed sizes
        │
        ▼
9. User downloads
```

## Key Technical Decisions

### Why browser-image-compression?
- Uses Web Workers (non-blocking)
- Handles EXIF orientation
- Quality control built-in
- Active maintenance, good docs

### Why Zustand over Context?
- Simpler API for this use case
- No provider wrapping needed
- Built-in devtools
- Note: May start with useState/useReducer for simplicity, migrate if needed

### Why Tailwind CSS?
- Rapid prototyping
- Consistent design system
- Small production bundle (purges unused)
- GitHub Pages friendly

## Error Handling

| Error Type | Handling |
|------------|----------|
| Invalid file type | Toast notification, file rejected |
| File too large (>50MB) | Warning, allow with disclaimer |
| Compression failure | Mark image as error, show retry |
| Browser incompatibility | Feature detection, graceful fallback |

## Performance Patterns

1. **Lazy thumbnail generation**: Only render visible thumbnails
2. **Debounced settings**: Don't recompress on every slider move
3. **Web Worker compression**: Main thread stays responsive
4. **Object URL cleanup**: Revoke URLs on unmount to prevent memory leaks
