/**
 * Premium WebAR Restaurant - Core Logic
 */

const FOOD_DATA = {
    // --- North Indian ---
    'butter-chicken': { name: 'Butter Chicken', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '32g', carbs: '12g', fiber: '2g', ingredients: ['Boneless Chicken', 'Tomato Purée', 'Fresh Cream', 'Butter', 'Kashmiri Mirch'] },
    'paneer-tikka': { name: 'Paneer Tikka', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '18g', carbs: '8g', fiber: '3g', ingredients: ['Paneer cubes', 'Yogurt', 'Bell Peppers', 'Tandoori Masala', 'Lemon'] },
    'dal-makhani': { name: 'Dal Makhani', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '14g', carbs: '38g', fiber: '12g', ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Garlic', 'Garam Masala'] },
    'garlic-naan': { name: 'Garlic Naan', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '8g', carbs: '45g', fiber: '2g', ingredients: ['Refined Flour', 'Fresh Garlic', 'Coriander', 'Nigella Seeds'] },
    'veg-biryani': { name: 'Veg Biryani', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.15 0.15 0.15', protein: '12g', carbs: '65g', fiber: '8g', ingredients: ['Basmati Rice', 'Saffron', 'Assorted Veggies', 'Mint', 'Biryani Spice'] },

    // --- Chinese ---
    'hakka-noodles': { name: 'Hakka Noodles', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '10g', carbs: '55g', fiber: '4g', ingredients: ['Egg Noodles', 'Cabbage', 'Soy Sauce', 'Spring Onions', 'Vinegar'] },
    'veg-manchurian': { name: 'Veg Manchurian', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '9g', carbs: '28g', fiber: '6g', ingredients: ['Vegetable Balls', 'Ginger', 'Green Chilies', 'Celery', 'Manchurian Sauce'] },
    'chilli-chicken': { name: 'Chilli Chicken', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '28g', carbs: '15g', fiber: '1g', ingredients: ['Chicken Thighs', 'Capsicum', 'Szechwan Sauce', 'Dry Whole Red Chilies'] },
    'dim-sums': { name: 'Veg Dim Sums', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '6g', carbs: '22g', fiber: '2g', ingredients: ['Water Chestnuts', 'Mushrooms', 'Translucent Wrappers', 'Sesame Oil'] },
    'spring-rolls': { name: 'Spring Rolls', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '5g', carbs: '32g', fiber: '3g', ingredients: ['Paper-thin Dough', 'Shredded Sprouts', 'Glass Noodles', 'Sweet Chilli Dip'] },

    // --- South Indian ---
    'masala-dosa': { name: 'Masala Dosa', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.2 0.2 0.2', protein: '10g', carbs: '75g', fiber: '6g', ingredients: ['Fermented Rice Crepe', 'Spiced Potato Filling', 'Coconut Chutney', 'Sambar'] },
    'idli-sambhar': { name: 'Idli Sambhar', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '8g', carbs: '42g', fiber: '4g', ingredients: ['Steamed Rice Cakes', 'Lentil Stew', 'Curry Leaves', 'Tamarind'] },
    'medu-vada': { name: 'Medu Vada', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '12g', carbs: '28g', fiber: '5g', ingredients: ['Black Gram Lentils', 'Peppercorns', 'Asafoetida', 'Green Chilies'] },
    'onion-uttapam': { name: 'Onion Uttapam', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.15 0.15 0.15', protein: '9g', carbs: '55g', fiber: '7g', ingredients: ['Thick Pancake', 'Sautéed Onions', 'Ginger', 'Green Chillies'] },
    'lemon-rice': { name: 'Lemon Rice', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '7g', carbs: '68g', fiber: '4g', ingredients: ['Pre-cooked Rice', 'Fresh Lemon Juice', 'Peanuts', 'Mustard Seeds', 'Turmeric'] },

    // --- Desserts ---
    'gulab-jamun': { name: 'Gulab Jamun', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '4g', carbs: '48g', fiber: '1g', ingredients: ['Milk Solids (Khoya)', 'Sugar Syrup', 'Cardamom', 'Rose Water', 'Pistachios'] },
    'rasmalai': { name: 'Rasmalai', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '8g', carbs: '32g', fiber: '1g', ingredients: ['Chenna Discs', 'Thickened Milk', 'Saffron', 'Almonds', 'Rose Water'] },
    'kulfi': { name: 'Kesar Kulfi', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '6g', carbs: '28g', fiber: '1g', ingredients: ['Reduced Milk', 'Saffron', 'Cardamom Powder', 'Crushed Nuts'] },
    'brownie': { name: 'Choco Brownie', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '5g', carbs: '42g', fiber: '3g', ingredients: ['Dark Chocolate', 'Cocoa Powder', 'Butter', 'Walnuts', 'Fudge Sauce'] },
    'ice-cream': { name: 'Premium Vanilla', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '4g', carbs: '25g', fiber: '0g', ingredients: ['Fresh Cream', 'Vanilla Pods', 'Whole Milk', 'Honey'] }
};

const AppState = {
    selectedFood: null,
    isCameraEnabled: false,
    typingIntervals: [],
    currentSection: 'home-scanner'
};

// ===================================
// Core State & Navigation
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍽️ Portal System Starting...');
    showHomeScreen();
});

function showHomeScreen() {
    // Completely reset to scanner
    AppState.currentSection = 'home-scanner';
    document.getElementById('app-navbar').classList.add('hidden');
    document.getElementById('ar-scene').style.opacity = '0';
    document.getElementById('ar-ui').classList.add('hidden');

    // Hide all portal screens
    document.querySelectorAll('.portal-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('home-scanner').classList.remove('hidden');
    document.getElementById('home-scanner').style.opacity = '1';
}

function showSection(sectionId) {
    console.log(`Navigating to: ${sectionId}`);
    AppState.currentSection = sectionId;

    // Hide scanner and other screens
    document.getElementById('home-scanner').classList.add('hidden');
    document.getElementById('ar-ui').classList.add('hidden');
    document.getElementById('ar-scene').style.opacity = '0';

    document.querySelectorAll('.portal-screen').forEach(s => {
        if (s.id === sectionId) {
            s.classList.remove('hidden');
        } else {
            s.classList.add('hidden');
        }
    });

    // Ensure navbar is visible
    document.getElementById('app-navbar').classList.remove('hidden');
}

async function simulateScan() {
    console.log('🔍 Scanning...');
    const btn = document.querySelector('.btn-demo-scan');
    btn.textContent = 'Verifying Barcode...';

    // Nudge camera permission early
    const granted = await requestCameraPermission();
    if (!granted) {
        btn.textContent = '[ Demo: Click to Scan ]';
        return;
    }

    setTimeout(() => {
        showSection('menu-screen');
        btn.textContent = '[ Demo: Click to Scan ]';
    }, 1000);
}

// ===================================
// AR & Camera Logic
// ===================================

async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        AppState.isCameraEnabled = true;

        // Show the AR scene background (camera feed)
        document.getElementById('ar-scene').style.opacity = '1';
        return true;
    } catch (err) {
        console.error('Camera blocked:', err);
        alert('Please enable camera access to scan and view food in AR.');
        return false;
    }
}

async function selectFood(foodId) {
    const food = FOOD_DATA[foodId];
    if (!food) return;

    AppState.selectedFood = food;

    // Load AR View
    document.querySelectorAll('.portal-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('ar-scene').style.opacity = '1';
    document.getElementById('ar-ui').classList.remove('hidden');

    loadARModel(food);
    startNutritionalAnimations(food);

    trackEvent({ action: 'view_food', item: foodId });
}

function loadARModel(food) {
    const model = document.getElementById('ar-model');
    if (!model) return;

    model.setAttribute('gltf-model', ''); // Clear first
    setTimeout(() => {
        model.setAttribute('gltf-model', food.model);
        model.setAttribute('scale', food.scale);
        model.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 0',
            loop: true,
            dur: 15000,
            easing: 'linear'
        });
    }, 50);
}

function startNutritionalAnimations(food) {
    AppState.typingIntervals.forEach(clearInterval);
    AppState.typingIntervals = [];

    typeEffect(document.getElementById('protein-value'), food.protein);
    typeEffect(document.getElementById('carbs-value'), food.carbs);
    typeEffect(document.getElementById('fiber-value'), food.fiber);

    const container = document.getElementById('ingredients-container');
    container.innerHTML = '';
    food.ingredients.forEach((ing, index) => {
        const li = document.createElement('li');
        container.appendChild(li);
        setTimeout(() => typeEffect(li, ing, 50), index * 800 + 1000);
    });
}

function typeEffect(element, text, speed = 100) {
    element.textContent = '';
    element.classList.add('typing-cursor');
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            element.classList.remove('typing-cursor');
        }
    }, speed);
    AppState.typingIntervals.push(interval);
}

// ===================================
// Form & Analytics
// ===================================

function submitFeedback() {
    const form = document.getElementById('feedback-form');
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Feedback Sent! Thank you.';
    btn.style.background = '#10b981';

    setTimeout(() => {
        btn.textContent = 'Submit Review';
        btn.style.background = 'var(--primary-gold)';
        form.reset();
        showSection('menu-screen');
    }, 2000);
}

function placeOrder() {
    const orderBtn = document.querySelector('.btn-order-now');
    orderBtn.textContent = 'Order Placed! 🍴';
    orderBtn.style.background = '#10b981';
    setTimeout(() => {
        orderBtn.textContent = 'Order Now';
        orderBtn.style.background = 'white';
    }, 2000);
}

async function trackEvent(data) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (e) { console.warn('Tracking offline'); }
}

// Global Exports
window.showHomeScreen = showHomeScreen;
window.showSection = showSection;
window.simulateScan = simulateScan;
window.selectFood = selectFood;
window.submitFeedback = submitFeedback;
window.placeOrder = placeOrder;
