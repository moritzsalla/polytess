Experiment in creating a tool for creating and manipulating Delaunay triangulations.

![Screenshot](./docs/Screenshot%202024-11-03%20at%2014.33.41.png)

![Screenshot](./docs/Screenshot%202024-10-08%20at%2019.31.01.png)

![Screenshot](./docs/Screenshot%202024-10-31%20at%2022.07.58.png)

![Screenshot](./docs/Screenshot%202024-10-08%20at%2019.30.45.png)

![Screenshot](./docs/Screenshot%202024-11-03%20at%2014.33.46.png)

## Features

- **Interactive Drawing**: Click or drag to create points
- **Multiple Visualization Modes**: 
  - Lines: Classic wireframe view
  - Dots: Minimalist point-based representation
  - Gradient: Beautiful color transitions
- **Real-time Processing**: Instant triangulation updates using Web Workers
- **Image Processing**: Convert images into triangulated patterns
- **Export**: Save your creations as SVG files
- **Theme Support**: Light and dark mode

## Quick Start

```bash
npm install
npm run dev
```

## Dependencies

- React 18
- Redux Toolkit
- TypeScript
- Web Workers for performance
- Delaunator adaption for triangulation

## License

MIT
