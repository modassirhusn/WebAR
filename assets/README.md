# Assets Directory

This directory contains additional resources for the WebAR experience.

## Recommended Structure

```
assets/
├── icons/          # UI icons and graphics
├── images/         # Background images, logos
├── sounds/         # Audio files (optional)
└── textures/       # Additional textures for 3D models
```

## Image Optimization

For best performance, optimize all images:

- **Format**: WebP (preferred), PNG, or JPG
- **Size**: Compress to smallest acceptable quality
- **Dimensions**: Use appropriate sizes (avoid oversized images)

### Tools
- [Squoosh](https://squoosh.app/) - Image compression
- [TinyPNG](https://tinypng.com/) - PNG/JPG optimization
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimization

## Icons

For UI icons, consider using:
- SVG format for scalability
- Icon fonts (Font Awesome, Material Icons)
- Inline SVG for better control

## Audio (Optional)

If adding sound effects or background music:
- **Format**: MP3 or OGG
- **Size**: Keep files small (< 1 MB)
- **Loading**: Lazy load audio files

## Usage in Code

Reference assets in your HTML/CSS/JS:

```html
<!-- HTML -->
<img src="./assets/images/logo.png" alt="Logo">

<!-- CSS -->
background-image: url('./assets/images/background.jpg');

<!-- JavaScript -->
const iconPath = './assets/icons/camera.svg';
```
