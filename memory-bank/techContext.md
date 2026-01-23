# Tech Context: Image Compressor

## Technology Stack

### Core Framework
- **React 18**: UI library with hooks
- **Vite 5**: Build tool and dev server
- **JavaScript (ES6+)**: No TypeScript for v1 prototype

### Styling
- **Tailwind CSS 3**: Utility-first CSS framework
- **PostCSS**: Required for Tailwind processing

### Image Processing
- **browser-image-compression**: Client-side compression library
  - Version: ^2.0.2
  - Features: Web Worker support, EXIF handling, quality control

### File Handling
- **JSZip**: Create ZIP archives in browser
- **FileSaver.js**: Trigger file downloads

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **gh-pages**: GitHub Pages deployment

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm

### Installation
```bash
cd image-compressor
npm install
```

### Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |

### Project Structure
```
image-compressor/
├── memory-bank/           # Project documentation
├── src/
│   ├── components/        # React components
│   │   ├── DropZone.jsx
│   │   ├── ImageCard.jsx
│   │   ├── ImageGrid.jsx
│   │   ├── CompressionControls.jsx
│   │   └── Header.jsx
│   ├── hooks/
│   │   └── useImages.js   # Image state management
│   ├── utils/
│   │   ├── compression.js # Compression helpers
│   │   └── fileHelpers.js # Size formatting, etc.
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind imports
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

## Technical Constraints

### GitHub Pages Limitations
- Static files only (HTML, CSS, JS, images)
- No server-side code execution
- No database or persistent storage
- SPA routing requires hash router or 404.html trick

### Browser Requirements
- Modern browsers with ES6+ support
- Canvas API for image manipulation
- Web Workers for background processing
- File API for drag-and-drop

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Production
```json
{
  "browser-image-compression": "^2.0.2",
  "jszip": "^3.10.1",
  "file-saver": "^2.0.5"
}
```

### Development
```json
{
  "vite": "^5.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "eslint": "^8.56.0",
  "gh-pages": "^6.1.0"
}
```

## Configuration Files

### vite.config.js
- Base path set for GitHub Pages subdirectory
- Build output to `dist/`

### tailwind.config.js
- Content paths for purging
- Custom theme extensions if needed

### GitHub Pages Deployment
1. Build creates `dist/` folder
2. `gh-pages` package pushes to `gh-pages` branch
3. GitHub serves from that branch
4. URL: `https://<username>.github.io/image-compressor/`

## API Reference

### browser-image-compression
```javascript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,              // Target file size
  maxWidthOrHeight: 1920,    // Max dimension
  useWebWorker: true,        // Background processing
  fileType: 'image/jpeg',    // Output format
  initialQuality: 0.8        // 0-1 scale
};

const compressedFile = await imageCompression(file, options);
```

### JSZip
```javascript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const zip = new JSZip();
zip.file('image1.jpg', blob1);
zip.file('image2.jpg', blob2);

const content = await zip.generateAsync({ type: 'blob' });
saveAs(content, 'compressed-images.zip');
```
