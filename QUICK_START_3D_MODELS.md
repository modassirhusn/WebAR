# 🚀 Quick Start: Add Your 3D Model in 3 Steps

## Step 1: Download a Model (2 minutes)

**Go to Sketchfab:**
👉 https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount

1. Search for: "low poly car" or "robot" or "furniture"
2. Click on a model you like
3. Click **"Download 3D Model"**
4. Select **"glTF"** format
5. Download (you'll get a `.glb` file)

---

## Step 2: Add to Project (30 seconds)

Move the downloaded file:
```
From: Downloads/model.glb
To:   WebAR/models/model.glb
```

---

## Step 3: Update Code (30 seconds)

Open `app.js` and find line 59:

**Change this:**
```javascript
defaultModel: 'https://cdn.glitch.global/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?v=1599849238130',
```

**To this:**
```javascript
defaultModel: './models/model.glb',  // Use your actual filename
```

---

## Done! 🎉

Refresh your browser and your new model will load!

---

## If Model is Too Big/Small

Edit the `scale` in `app.js` (line 71):

```javascript
scale: { x: 0.5, y: 0.5, z: 0.5 },  // Makes it smaller
// or
scale: { x: 2, y: 2, z: 2 },  // Makes it bigger
```

---

## Recommended Models to Try

**Search on Sketchfab for:**
- "low poly car downloadable" - Fast loading, looks great
- "robot glb downloadable" - Perfect for tech demos
- "chair downloadable" - Good for furniture AR
- "low poly fox downloadable" - Fun and cute

**Filter:** Make sure to check "Downloadable" and select "Free" license

---

## Need Help?

See the full guide: `HOW_TO_ADD_3D_MODELS.md`
