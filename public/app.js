/**
 * WebAR Menu - Md Modassir Hussain
 * "We show you reality so you do not pay for fake food."
 */

// ========== FOOD DATA ==========
const FOOD_DATA = {
    // North Indian
    'butter-chicken': { name: 'Butter Chicken', price: 350, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '32g', carbs: '12g', fiber: '2g', ingredients: ['Boneless Chicken', 'Tomato Purée', 'Fresh Cream', 'Butter', 'Kashmiri Mirch'] },
    'paneer-tikka': { name: 'Paneer Tikka', price: 280, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '18g', carbs: '8g', fiber: '3g', ingredients: ['Paneer cubes', 'Yogurt', 'Bell Peppers', 'Tandoori Masala'] },
    'dal-makhani': { name: 'Dal Makhani', price: 220, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '14g', carbs: '38g', fiber: '12g', ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Garlic'] },
    'garlic-naan': { name: 'Garlic Naan', price: 60, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '8g', carbs: '45g', fiber: '2g', ingredients: ['Refined Flour', 'Fresh Garlic', 'Coriander'] },
    'veg-biryani': { name: 'Veg Biryani', price: 320, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.15 0.15 0.15', protein: '12g', carbs: '65g', fiber: '8g', ingredients: ['Basmati Rice', 'Saffron', 'Vegetables', 'Mint'] },

    // Chinese
    'hakka-noodles': { name: 'Hakka Noodles', price: 240, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '10g', carbs: '55g', fiber: '4g', ingredients: ['Egg Noodles', 'Cabbage', 'Soy Sauce'] },
    'veg-manchurian': { name: 'Veg Manchurian', price: 220, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '9g', carbs: '28g', fiber: '6g', ingredients: ['Vegetable Balls', 'Ginger', 'Green Chilies'] },
    'chilli-chicken': { name: 'Chilli Chicken', price: 290, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '28g', carbs: '15g', fiber: '1g', ingredients: ['Chicken', 'Capsicum', 'Szechwan Sauce'] },
    'dim-sums': { name: 'Veg Dim Sums', price: 180, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '6g', carbs: '22g', fiber: '2g', ingredients: ['Water Chestnuts', 'Mushrooms', 'Wrappers'] },
    'spring-rolls': { name: 'Spring Rolls', price: 150, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '5g', carbs: '32g', fiber: '3g', ingredients: ['Thin Dough', 'Sprouts', 'Glass Noodles'] },

    // South Indian
    'masala-dosa': { name: 'Masala Dosa', price: 180, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.2 0.2 0.2', protein: '10g', carbs: '75g', fiber: '6g', ingredients: ['Rice Crepe', 'Potato Filling', 'Chutney'] },
    'idli-sambhar': { name: 'Idli Sambhar', price: 140, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '8g', carbs: '42g', fiber: '4g', ingredients: ['Rice Cakes', 'Lentil Stew', 'Tamarind'] },
    'medu-vada': { name: 'Medu Vada', price: 140, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '12g', carbs: '28g', fiber: '5g', ingredients: ['Black Gram', 'Peppercorns', 'Asafoetida'] },
    'onion-uttapam': { name: 'Onion Uttapam', price: 160, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.15 0.15 0.15', protein: '9g', carbs: '55g', fiber: '7g', ingredients: ['Thick Pancake', 'Onions', 'Ginger'] },
    'lemon-rice': { name: 'Lemon Rice', price: 160, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '7g', carbs: '68g', fiber: '4g', ingredients: ['Rice', 'Lemon Juice', 'Peanuts'] },

    // Desserts
    'gulab-jamun': { name: 'Gulab Jamun', price: 90, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '4g', carbs: '48g', fiber: '1g', ingredients: ['Milk Solids', 'Sugar Syrup', 'Cardamom'] },
    'rasmalai': { name: 'Rasmalai', price: 110, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '8g', carbs: '32g', fiber: '1g', ingredients: ['Chenna', 'Thickened Milk', 'Saffron'] },
    'kulfi': { name: 'Kesar Kulfi', price: 80, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '6g', carbs: '28g', fiber: '1g', ingredients: ['Milk', 'Saffron', 'Crushed Nuts'] },
    'brownie': { name: 'Choco Brownie', price: 140, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '5g', carbs: '42g', fiber: '3g', ingredients: ['Chocolate', 'Cocoa', 'Walnuts'] },
    'ice-cream': { name: 'Premium Vanilla', price: 70, model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '4g', carbs: '25g', fiber: '0g', ingredients: ['Fresh Cream', 'Vanilla', 'Milk'] }
};

// ========== APP STATE ==========
let currentFood = null;
let plateQty = 1;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🍽️ WebAR Menu Starting...');

    // Request camera permission IMMEDIATELY on page load
    await requestCameraPermission();

    // Show scanner view
    showHomeScreen();
});

// ========== CAMERA PERMISSION ==========
async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        stream.getTracks().forEach(track => track.stop());
        console.log('✅ Camera permission granted');

        // Make AR scene visible
        document.getElementById('ar-scene').style.opacity = '1';
        return true;
    } catch (err) {
        console.error('❌ Camera permission denied:', err);
        alert('Please allow camera access to use this app. It is required for scanning and viewing food in AR.');
        return false;
    }
}

// ========== NAVIGATION ==========
function showHomeScreen() {
    hideAllViews();
    document.getElementById('home-scanner').classList.remove('hidden');
}

function showSection(sectionId) {
    hideAllViews();
    document.getElementById(sectionId).classList.remove('hidden');
}

function hideAllViews() {
    document.querySelectorAll('.full-screen-view').forEach(el => el.classList.add('hidden'));
    document.getElementById('ar-view').classList.add('hidden');
}

// ========== BARCODE SCAN (Demo) ==========
function simulateScan() {
    const btn = document.querySelector('.btn-scan-demo');
    btn.textContent = 'Scanning...';
    btn.disabled = true;

    setTimeout(() => {
        // After "scanning", show the menu
        showSection('menu-screen');
        btn.textContent = '[ Demo: Tap to Scan ]';
        btn.disabled = false;
    }, 1500);
}

// ========== AR VIEW ==========
function openAR(foodId) {
    const food = FOOD_DATA[foodId];
    if (!food) return;

    currentFood = food;
    plateQty = 1;

    // Update AR UI
    document.getElementById('ar-dish-name').textContent = food.name;
    document.getElementById('ar-protein').textContent = food.protein;
    document.getElementById('ar-carbs').textContent = food.carbs;
    document.getElementById('ar-fiber').textContent = food.fiber;
    document.getElementById('plate-qty').textContent = plateQty;

    // Ingredients
    const ingredientsList = document.getElementById('ar-ingredients-list');
    ingredientsList.innerHTML = '';
    food.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        ingredientsList.appendChild(li);
    });

    // Load 3D model
    const model = document.getElementById('ar-model');
    model.setAttribute('gltf-model', food.model);
    model.setAttribute('scale', food.scale);

    // Show AR view
    hideAllViews();
    document.getElementById('ar-view').classList.remove('hidden');
    document.getElementById('ar-scene').style.opacity = '1';
}

function closeAR() {
    document.getElementById('ar-view').classList.add('hidden');
    showSection('menu-screen');
}

// ========== ORDER CONTROLS ==========
function changeQty(delta) {
    plateQty = Math.max(1, plateQty + delta);
    document.getElementById('plate-qty').textContent = plateQty;
}

function placeOrder() {
    if (!currentFood) return;

    const total = currentFood.price * plateQty;
    alert(`✅ Added to order!\n\n${plateQty}x ${currentFood.name}\nTotal: ₹${total}`);

    // Track the order
    trackEvent({ action: 'order', item: currentFood.name, quantity: plateQty });
}

// ========== FEEDBACK ==========
function submitFeedback() {
    alert('Thank you for your feedback! 🙏');
    showHomeScreen();
}

// ========== ANALYTICS ==========
async function trackEvent(data) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, timestamp: new Date().toISOString() })
        });
    } catch (e) {
        console.log('Analytics skipped');
    }
}

// ========== GLOBAL EXPORTS ==========
window.showHomeScreen = showHomeScreen;
window.showSection = showSection;
window.simulateScan = simulateScan;
window.openAR = openAR;
window.closeAR = closeAR;
window.changeQty = changeQty;
window.placeOrder = placeOrder;
window.submitFeedback = submitFeedback;
