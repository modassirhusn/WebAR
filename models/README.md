# 3D Models Directory

Place your 3D models here in GLB or GLTF format.

## Recommended Model Specifications

For optimal performance on mobile devices:

- **File Format**: `.glb` (preferred) or `.gltf`
- **File Size**: < 5 MB (compressed)
- **Polygon Count**: < 50,000 triangles
- **Texture Resolution**: 512×512 or 1024×1024 (power-of-2)
- **Compression**: Use Draco compression for smaller file sizes

## Free 3D Model Resources

- [Sketchfab](https://sketchfab.com/feed) - Downloadable 3D models
- [Poly Pizza](https://poly.pizza/) - Low-poly models
- [Google Poly Archive](https://poly.pizza/google)
- [Free3D](https://free3d.com/)

## Optimizing Your Models

Use [glTF-Transform](https://gltf-transform.donmccurdy.com/) to optimize:

```bash
npm install -g @gltf-transform/cli

# Optimize
gltf-transform optimize input.glb output.glb

# Add Draco compression
gltf-transform draco input.glb output.glb
```

## Default Model

The app currently uses a CDN-hosted astronaut model for demonstration. To use your own model:

1. Add your `.glb` file to this directory
2. Update `app.js`:
   ```javascript
   const CONFIG = {
       defaultModel: './models/your-model.glb',
   };
   ```

## iOS USDZ Support (Optional)

For iOS Quick Look fallback, you can also add `.usdz` files:

```
models/
├── model.glb      # For WebXR
└── model.usdz     # For iOS Quick Look
```

Convert GLB to USDZ using:
- [Reality Converter](https://developer.apple.com/augmented-reality/tools/) (macOS)
- [Blender USD Export](https://www.blender.org/)
