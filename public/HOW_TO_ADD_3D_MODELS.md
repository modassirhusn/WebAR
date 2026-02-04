# 🎨 How to Add Your Own 3D Models

Quick guide to download and use custom 3D models in your WebAR project.

---

## 📥 Step 1: Download Free 3D Models

### **Best Free Sources:**

#### 1. **Sketchfab** (Recommended) ⭐
- **URL**: [sketchfab.com](https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount)
- **Filter**: Check "Downloadable" + "Free"
- **Format**: Download as **GLB** or **GLTF**

**How to Download:**
1. Go to [sketchfab.com/3d-models](https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount)
2. Search for what you want (e.g., "car", "robot", "furniture")
3. Click on a model
4. Click **"Download 3D Model"** button
5. Select **"glTF"** format
6. Download the file

#### 2. **Poly Pizza** (Google Poly Archive)
- **URL**: [poly.pizza](https://poly.pizza/)
- **Best for**: Low-poly models (better performance)
- **Format**: GLB/GLTF available

#### 3. **Free3D**
- **URL**: [free3d.com](https://free3d.com/3d-models/gltf)
- **Filter**: Search for "glb" or "gltf"

#### 4. **CGTrader** (Free Section)
- **URL**: [cgtrader.com/free-3d-models](https://www.cgtrader.com/free-3d-models)
- **Filter**: File format → glTF

---

## 📂 Step 2: Add Model to Your Project

### **Option A: Use Local File**

1. **Download your `.glb` file** from Sketchfab or another source

2. **Place it in the models folder:**
   ```
   WebAR/
   └── models/
       └── your-model.glb  ← Put your file here
   ```

3. **Update `app.js`** (around line 30):
   ```javascript
   const CONFIG = {
       // Change this line:
       defaultModel: './models/your-model.glb',
       // Replace 'your-model.glb' with your actual filename
   };
   ```

### **Option B: Use CDN URL**

If you have a model hosted online:

```javascript
const CONFIG = {
    defaultModel: 'https://your-cdn.com/model.glb',
};
```

---

## 🎯 Step 3: Quick Example

Let's say you downloaded a **robot.glb** from Sketchfab:

1. **Move the file:**
   - From: `Downloads/robot.glb`
   - To: `WebAR/models/robot.glb`

2. **Edit `app.js`:**
   ```javascript
   const CONFIG = {
       defaultModel: './models/robot.glb',
       
       modelDefaults: {
           position: { x: 0, y: 0, z: -3 },
           rotation: { x: 0, y: 0, z: 0 },
           scale: { x: 1, y: 1, z: 1 },  // Adjust if too big/small
       },
   };
   ```

3. **Test:**
   - Refresh your browser
   - The new model should load!

---

## ⚙️ Step 4: Optimize Your Model (Important!)

For best mobile performance, your model should be:

- **File Size**: < 5 MB
- **Polygons**: < 50,000 triangles
- **Textures**: 1024×1024 or smaller

### **If Your Model is Too Large:**

Use **glTF-Transform** to compress it:

```bash
# Install the tool
npm install -g @gltf-transform/cli

# Optimize your model
gltf-transform optimize models/your-model.glb models/your-model-optimized.glb

# Add Draco compression (makes it even smaller)
gltf-transform draco models/your-model.glb models/your-model-compressed.glb
```

Then use the optimized version in your app.

---

## 🔧 Step 5: Adjust Model Settings

If your model appears too big, too small, or in the wrong position:

**Edit `app.js`:**

```javascript
const CONFIG = {
    defaultModel: './models/your-model.glb',
    
    modelDefaults: {
        // Move closer/farther
        position: { x: 0, y: 0, z: -2 },  // -2 = closer, -5 = farther
        
        // Rotate the model
        rotation: { x: 0, y: 45, z: 0 },  // Rotate 45° on Y-axis
        
        // Make bigger/smaller
        scale: { x: 0.5, y: 0.5, z: 0.5 },  // 0.5 = half size, 2 = double size
    },
};
```

---

## 🎨 Recommended Models to Try

Here are some great free models to get started:

### **From Sketchfab:**

1. **Low Poly Car**
   - Search: "low poly car downloadable"
   - Good for: Testing, fast loading

2. **Robot**
   - Search: "robot glb downloadable"
   - Good for: Tech demos

3. **Furniture**
   - Search: "chair glb downloadable"
   - Good for: Product visualization

4. **Animals**
   - Search: "low poly fox downloadable"
   - Good for: Fun demos

---

## 📋 Quick Checklist

- [ ] Download `.glb` file from Sketchfab or Poly Pizza
- [ ] Place file in `WebAR/models/` folder
- [ ] Update `defaultModel` path in `app.js`
- [ ] Test locally (refresh browser)
- [ ] Adjust scale/position if needed
- [ ] Optimize if file is > 5 MB
- [ ] Deploy and test on mobile

---

## 🚨 Troubleshooting

### **Model doesn't appear:**
- Check browser console (F12) for errors
- Verify file path is correct
- Make sure file is `.glb` format (not `.obj` or `.fbx`)

### **Model is too big/small:**
- Adjust `scale` in `modelDefaults`
- Try values like `0.1`, `0.5`, `2`, `5`

### **Model is in wrong position:**
- Adjust `position.z` (distance from camera)
- Try values from `-1` to `-10`

### **Model loads slowly:**
- File is too large - use glTF-Transform to compress
- Or find a simpler model with fewer polygons

---

## 🎯 Next Steps

1. **Download a model** from Sketchfab
2. **Add it to your project** following Step 2
3. **Test locally** to see if it works
4. **Deploy** to test in AR on mobile

**Need help?** Check the browser console (F12) for error messages!

---

**Ready to add your first model? Start with Sketchfab - it's the easiest!** 🚀

[← Back to README](README.md)
