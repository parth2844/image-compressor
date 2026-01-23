# Active Context: Image Compressor

## Current Focus
Building the initial prototype with core compression functionality.

## Recent Changes
- Initialized git repository
- Created Memory Bank structure with all core documentation files
- Defined tech stack: React + Vite + Tailwind CSS

## Next Steps
1. Scaffold Vite + React project
2. Configure Tailwind CSS
3. Install compression libraries
4. Build DropZone component for file upload
5. Implement basic compression with quality slider
6. Add file size display (before/after)
7. Add download functionality
8. Test and make initial commit

## Active Decisions

### Decided
- **Framework**: React 18 with Vite (fast DX, GitHub Pages compatible)
- **Styling**: Tailwind CSS (rapid prototyping, no custom CSS)
- **Compression**: browser-image-compression (Web Worker support, active maintenance)
- **State**: Start with useState/useReducer, migrate to Zustand if needed

### Open Questions
- Should we add dark mode toggle in v1?
- What should be the default quality setting? (Leaning toward 80%)
- Should we auto-compress on upload or wait for user action?

## Important Patterns

### File Handling
- Use `URL.createObjectURL()` for image previews
- Clean up object URLs on component unmount to prevent memory leaks
- Validate file types before processing

### Compression Settings
- Quality: 1-100 scale (maps to 0.01-1.0 internally)
- Default format: JPEG for photos, WebP as option
- Max dimension: Optional constraint for resize

## Current Session Notes
- Project initialized on Desktop
- Memory Bank populated with project context
- Ready to scaffold React application
