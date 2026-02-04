# 🍽️ Premium WebAR Restaurant

A high-end, browser-based Augmented Reality dining experience. Scan a QR code, select your dish from a premium menu, and view it in **exact life-size** in your real-world space with animated nutritional data.

![WebXR-Enabled](https://img.shields.io/badge/WebXR-Enabled-gold) ![Premium-Design](https://img.shields.io/badge/Design-Premium-gold)

## 🎯 Features

- **Premium Menu Interface**: Sleek glassmorphic selection screen for signature dishes.
- **Life-Size AR Rendering**: Models are calibrated to 1:1 real-world scale (e.g., a 6-inch pizza looks exactly 6 inches).
- **Animated Nutritional Overlays**: Interactive floating labels for Protein, Carbs, and Fiber with animated indicators.
- **Ingredient Insights**: Detailed ingredient lists displayed in a premium side panel.
- **Seamless Order Flow**: "Order Now" functionality with instant visual feedback and backend tracking.
- **No App Required**: Works instantly in modern mobile browsers via WebXR and AR.js.

## 📱 User Flow

1. **Scan QR Code** → Opens the premium menu selection page.
2. **Select Dish** → Request camera permission (only when selection is made).
3. **AR View** → Dish appears in real-world size with animated nutritional stats.
4. **Order** → Tape "Order Now" to add to cart.
5. **Back** → Smooth return to the menu for further selections.

## 🛠 Tech Stack

- **A-Frame 1.5.0** - WebXR framework for 3D/AR.
- **AR.js** - Webcam integration and tracking.
- **MongoDB** - Backend persistence for engagement and orders.
- **Mongoose** - Database modeling.
- **CSS3** - Glassmorphism, premium typography (Outfit), and keyframe animations.

## 📂 Project Highlights

- `index.html`: Premium UI structure and A-Frame scene.
- `app.js`: Food data management, life-size scaling logic, and state transitions.
- `styles.css`: High-end restaurant theme and nutritional arrow animations.
- `api/track.js`: Serverless handler for database logging.

## 🚀 Getting Started

### Local Development
1. Clone the repository.
2. Run `npm install` to get dependencies (Mongoose).
3. Set `MONGODB_URI` in `.env.local` for tracking.
4. Run `npm run dev` and access via a mobile device through a secure tunnel (e.g., ngrok) or local network with HTTPS.

### Adding New Dishes
Edit `FOOD_DATA` in `app.js`:
```javascript
const FOOD_DATA = {
    new_dish: {
        name: 'Gourmet Steak',
        model: './models/steak.glb',
        scale: '0.2 0.2 0.2', // Meters
        protein: '45g',
        carbs: '10g',
        fiber: '5g',
        ingredients: ['Prime Rib', 'Asparagus', 'Truffle Butter']
    }
};
```

## 📐 Life-Size Calibration
We use A-Frame's standard unit (1 unit = 1 meter). To ensure "exact size":
- A 15cm pizza should have a bounding box of Roughly 0.15 units.
- Calibration is handled in the `scale` property of each food item in `app.js`.

---

**Built for the next generation of digital dining. 🚀**