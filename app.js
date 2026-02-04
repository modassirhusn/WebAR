/**
 * Premium WebAR Restaurant - Core Logic
 */

const FOOD_DATA = {
    pizza: {
        name: 'Artisan Pizza',
        model: './models/pizza.glb',
        scale: '0.15 0.15 0.15', // Calibrated for roughly 6-10 inches (A-Frame scale depend on model mesh)
        // Note: 1 unit in A-Frame = 1 meter. 
        // 0.15 usually maps to ~15cm for a typical 1-unit model mesh.
        protein: '24g',
        carbs: '45g',
        fiber: '4g',
        ingredients: ['Sourdough', 'Buffalo Mozzarella', 'San Marzano Tomato', 'Basil', 'Extra Virgin Olive Oil']
    },
    croissant: {
        name: 'Butter Croissant',
        model: './models/croissant.glb',
        scale: '0.08 0.08 0.08', // ~8cm height/width
        protein: '8g',
        carbs: '22g',
        fiber: '1g',
        ingredients: ['French Butter', 'Pastry Flour', 'Organic Milk', 'Sea Salt']
    }
};

const AppState = {
    selectedFood: null,
    isCameraEnabled: false,
};

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍽️ Premium Restaurant AR Starting...');
    initMenu();
});

function initMenu() {
    // Menu is visible by default in HTML
}

// ===================================
// Interaction Handlers
// ===================================

async function selectFood(foodId) {
    console.log(`Selection: ${foodId}`);
    const food = FOOD_DATA[foodId];
    if (!food) return;

    AppState.selectedFood = food;

    // 1. Request Camera Permission if not already granted
    if (!AppState.isCameraEnabled) {
        const granted = await requestCameraPermission();
        if (!granted) return;
    }

    // 2. Load Model & Data
    loadARModel(food);
    updateNutritionalUI(food);

    // 3. Switch View
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('ar-ui').classList.remove('hidden');

    // Track Engagement
    trackEvent({ action: 'view_food', item: foodId });
}

async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        AppState.isCameraEnabled = true;
        return true;
    } catch (err) {
        console.error('Camera denied:', err);
        alert('Camera access is required to view the food in AR.');
        return false;
    }
}

function loadARModel(food) {
    const model = document.getElementById('ar-model');
    if (!model) return;

    model.setAttribute('gltf-model', food.model);
    model.setAttribute('scale', food.scale);

    // Apply a subtle rotation animation
    model.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 10000,
        easing: 'linear'
    });
}

function updateNutritionalUI(food) {
    document.getElementById('protein-value').textContent = food.protein;
    document.getElementById('carbs-value').textContent = food.carbs;
    document.getElementById('fiber-value').textContent = food.fiber;

    const ingredientsList = document.getElementById('ingredients-container');
    ingredientsList.innerHTML = food.ingredients.map(ing => `<li>${ing}</li>`).join('');
}

function goBackToMenu() {
    document.getElementById('menu-screen').classList.remove('hidden');
    document.getElementById('ar-ui').classList.add('hidden');

    // Clear model to save resources
    const model = document.getElementById('ar-model');
    if (model) model.removeAttribute('gltf-model');
}

function placeOrder() {
    const food = AppState.selectedFood;
    if (!food) return;

    // Visual feedback
    const orderBtn = document.querySelector('.btn-order-now');
    orderBtn.textContent = 'Added to Cart! 🛒';
    orderBtn.style.background = '#10b981';

    trackEvent({ action: 'add_to_cart', item: food.name });

    setTimeout(() => {
        orderBtn.textContent = 'Order Now';
        orderBtn.style.background = 'var(--primary-gold)';
    }, 2000);
}

// ===================================
// Analytics
// ===================================

async function trackEvent(data) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.warn('Tracking offline');
    }
}

// Exposed for HTML events
window.selectFood = selectFood;
window.goBackToMenu = goBackToMenu;
window.placeOrder = placeOrder;
