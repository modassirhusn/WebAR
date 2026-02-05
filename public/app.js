/**
 * Premium WebAR Restaurant - Core Logic
 */

const FOOD_DATA = {
    // --- North Indian ---
    'butter-chicken': { category: 'North Indian', name: 'Butter Chicken', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '32g', carbs: '12g', fiber: '2g', ingredients: ['Boneless Chicken', 'Tomato Purée', 'Fresh Cream', 'Butter', 'Kashmiri Mirch'] },
    'paneer-tikka': { category: 'North Indian', name: 'Paneer Tikka', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '18g', carbs: '8g', fiber: '3g', ingredients: ['Paneer cubes', 'Yogurt', 'Bell Peppers', 'Tandoori Masala', 'Lemon'] },
    'dal-makhani': { category: 'North Indian', name: 'Dal Makhani', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '14g', carbs: '38g', fiber: '12g', ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Garlic', 'Garam Masala'] },
    'garlic-naan': { category: 'North Indian', name: 'Garlic Naan', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '8g', carbs: '45g', fiber: '2g', ingredients: ['Refined Flour', 'Fresh Garlic', 'Coriander', 'Nigella Seeds'] },
    'veg-biryani': { category: 'North Indian', name: 'Veg Biryani', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.15 0.15 0.15', protein: '12g', carbs: '65g', fiber: '8g', ingredients: ['Basmati Rice', 'Saffron', 'Assorted Veggies', 'Mint', 'Biryani Spice'] },

    // --- Chinese ---
    'hakka-noodles': { category: 'Oriental Fusion', name: 'Hakka Noodles', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '10g', carbs: '55g', fiber: '4g', ingredients: ['Egg Noodles', 'Cabbage', 'Soy Sauce', 'Spring Onions', 'Vinegar'] },
    'veg-manchurian': { category: 'Oriental Fusion', name: 'Veg Manchurian', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '9g', carbs: '28g', fiber: '6g', ingredients: ['Vegetable Balls', 'Ginger', 'Green Chilies', 'Celery', 'Manchurian Sauce'] },
    'chilli-chicken': { category: 'Oriental Fusion', name: 'Chilli Chicken', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '28g', carbs: '15g', fiber: '1g', ingredients: ['Chicken Thighs', 'Capsicum', 'Szechwan Sauce', 'Dry Whole Red Chilies'] },
    'dim-sums': { category: 'Oriental Fusion', name: 'Veg Dim Sums', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '6g', carbs: '22g', fiber: '2g', ingredients: ['Water Chestnuts', 'Mushrooms', 'Translucent Wrappers', 'Sesame Oil'] },
    'spring-rolls': { category: 'Oriental Fusion', name: 'Spring Rolls', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '5g', carbs: '32g', fiber: '3g', ingredients: ['Paper-thin Dough', 'Shredded Sprouts', 'Glass Noodles', 'Sweet Chilli Dip'] },

    // --- South Indian ---
    'masala-dosa': { category: 'South Indian', name: 'Masala Dosa', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.2 0.2 0.2', protein: '10g', carbs: '75g', fiber: '6g', ingredients: ['Fermented Rice Crepe', 'Spiced Potato Filling', 'Coconut Chutney', 'Sambar'] },
    'idli-sambhar': { category: 'South Indian', name: 'Idli Sambhar', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '8g', carbs: '42g', fiber: '4g', ingredients: ['Steamed Rice Cakes', 'Lentil Stew', 'Curry Leaves', 'Tamarind'] },
    'medu-vada': { category: 'South Indian', name: 'Medu Vada', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '12g', carbs: '28g', fiber: '5g', ingredients: ['Black Gram Lentils', 'Peppercorns', 'Asafoetida', 'Green Chilies'] },
    'onion-uttapam': { category: 'South Indian', name: 'Onion Uttapam', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.15 0.15 0.15', protein: '9g', carbs: '55g', fiber: '7g', ingredients: ['Thick Pancake', 'Sautéed Onions', 'Ginger', 'Green Chillies'] },
    'lemon-rice': { category: 'South Indian', name: 'Lemon Rice', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.12 0.12 0.12', protein: '7g', carbs: '68g', fiber: '4g', ingredients: ['Pre-cooked Rice', 'Fresh Lemon Juice', 'Peanuts', 'Mustard Seeds', 'Turmeric'] },

    // --- Desserts ---
    'gulab-jamun': { category: 'Desserts', name: 'Gulab Jamun', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '4g', carbs: '48g', fiber: '1g', ingredients: ['Milk Solids (Khoya)', 'Sugar Syrup', 'Cardamom', 'Rose Water', 'Pistachios'] },
    'rasmalai': { category: 'Desserts', name: 'Rasmalai', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '8g', carbs: '32g', fiber: '1g', ingredients: ['Chenna Discs', 'Thickened Milk', 'Saffron', 'Almonds', 'Rose Water'] },
    'kulfi': { category: 'Desserts', name: 'Kesar Kulfi', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.08 0.08 0.08', protein: '6g', carbs: '28g', fiber: '1g', ingredients: ['Reduced Milk', 'Saffron', 'Cardamom Powder', 'Crushed Nuts'] },
    'brownie': { category: 'Desserts', name: 'Choco Brownie', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '5g', carbs: '42g', fiber: '3g', ingredients: ['Dark Chocolate', 'Cocoa Powder', 'Butter', 'Walnuts', 'Fudge Sauce'] },
    'ice-cream': { category: 'Desserts', name: 'Premium Vanilla', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.1 0.1 0.1', protein: '4g', carbs: '25g', fiber: '0g', ingredients: ['Fresh Cream', 'Vanilla Pods', 'Whole Milk', 'Honey'] }
};

const AppState = {
    selectedFood: null,
    isCameraEnabled: false,
    isPlaced: false,
    typingIntervals: [],
    currentSection: 'home-scanner',
    currentCategory: 'North Indian'
};

// ===================================
// Core Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('💎 High-Fidelity Portal Starting...');
    initARInteraction();
    renderMenu();
    showHomeScreen();
});

// ===================================
// Menu & UI Logic
// ===================================

function renderMenu() {
    const container = document.getElementById('menu-grid-container');
    container.innerHTML = '';

    const foodIds = Object.keys(FOOD_DATA);
    const filtered = foodIds.filter(id => {
        const food = FOOD_DATA[id];
        const matchesCategory = food.category === AppState.currentCategory;
        return matchesCategory;
    });

    filtered.forEach(id => {
        const dish = FOOD_DATA[id];
        const card = document.createElement('div');
        card.className = 'dish-card-minimal';
        card.innerHTML = `
            <div class="dish-info">
                <h4>${dish.name}</h4>
                <p>$${Math.floor(Math.random() * 10 + 10)}.00</p>
            </div>
            <button class="btn-view" onclick="openPreview('${id}')">Preview</button>
        `;
        container.appendChild(card);
    });
}

function filterCategory(category) {
    AppState.currentCategory = category;

    // Update tabs UI
    document.querySelectorAll('.tab-item').forEach(tab => {
        if (tab.textContent === category || (category === 'Chinese' && tab.textContent === 'Oriental Fusion')) { // Corrected 'Oriental Fusion' to 'Chinese'
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    renderMenu();
}

function filterMenu(query) {
    const q = query.toLowerCase();
    const container = document.getElementById('menu-grid-container');
    const cards = container.querySelectorAll('.dish-card-minimal');

    cards.forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        card.style.display = name.includes(q) ? 'flex' : 'none';
    });
}

function toggleQRModal() {
    document.getElementById('qr-modal').classList.toggle('hidden');
}

function toggleLanguage() {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    document.documentElement.lang = newLang;

    // Update text content based on language (example, needs more robust implementation)
    document.getElementById('lang-toggle-btn').textContent = newLang.toUpperCase();
    // You would typically have a dictionary or a more complex system here
    // For now, just toggling the button text.
}

// ===================================
// 3D Pedestal Preview
// ===================================

function openPreview(foodId) {
    const food = FOOD_DATA[foodId];
    AppState.selectedFood = food;

    // UI Updates
    document.getElementById('preview-name').textContent = food.name;
    document.getElementById('preview-price').textContent = `$${Math.floor(Math.random() * 10 + 10)}.00`;

    showSection('preview-mode');

    // Create a mini 3D Scene for Pedestal
    const pedestal = document.getElementById('pedestal-container');
    pedestal.innerHTML = `
        <a-scene embedded vr-mode-ui="enabled: false" style="height: 100%; width: 100%;">
            <a-assets>
                <a-asset-item id="preview-model-asset" src="${food.model}"></a-asset-item>
            </a-assets>
            <a-light type="ambient" intensity="1.5"></a-light>
            <a-light type="directional" intensity="1" position="1 2 1"></a-light>
            <a-entity position="0 0 -3">
                <a-gltf-model src="#preview-model-asset" 
                    scale="${food.scale}" 
                    animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear">
                </a-gltf-model>
                <!-- Pedestal Base -->
                <a-cylinder position="0 -0.5 0" radius="0.8" height="0.1" color="#222" metalness="0.5"></a-cylinder>
            </a-entity>
            <a-sky color="#0d0d0d"></a-sky>
            <a-entity camera look-controls="enabled: true" position="0 1.5 0"></a-entity>
        </a-scene>
    `;
}

async function enterARMode() {
    // Nudge camera permission early
    const granted = await requestCameraPermission();
    if (!granted) {
        return;
    }

    // Transition from Pedestal to True AR
    document.getElementById('preview-mode').classList.add('hidden');
    document.getElementById('main-header').classList.add('hidden');

    document.getElementById('ar-scene').style.opacity = '1';
    document.getElementById('ar-ui').classList.remove('hidden');
    document.getElementById('placement-instruction').classList.remove('hidden');

    AppState.isPlaced = false;
    AppState.currentSection = 'ar-view'; // Set current section for reticle logic
    document.getElementById('model-container').setAttribute('visible', 'false');

    loadARModel(AppState.selectedFood);
    startNutritionalAnimations(AppState.selectedFood);
    trackEvent({ action: 'view_food_ar', item: AppState.selectedFood.name });
}

// ===================================
// Navigation & State
// ===================================

function showHomeScreen() {
    AppState.currentSection = 'home-scanner';
    AppState.isPlaced = false;

    document.getElementById('main-header').classList.add('hidden');
    document.getElementById('ar-scene').style.opacity = '0';
    document.getElementById('ar-ui').classList.add('hidden');
    document.getElementById('preview-mode').classList.add('hidden');

    document.querySelectorAll('.portal-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('home-scanner').classList.remove('hidden');
    document.getElementById('home-scanner').style.opacity = '1';

    document.getElementById('model-container').setAttribute('visible', 'false');
}

function showSection(sectionId) {
    AppState.currentSection = sectionId;

    // Hide others
    document.getElementById('home-scanner').classList.add('hidden');
    document.getElementById('ar-ui').classList.add('hidden');
    document.getElementById('preview-mode').classList.add('hidden');
    document.getElementById('ar-scene').style.opacity = '0';

    document.querySelectorAll('.portal-screen').forEach(s => {
        if (s.id === sectionId) {
            s.classList.remove('hidden');
        } else {
            s.classList.add('hidden');
        }
    });

    document.getElementById('main-header').classList.remove('hidden');
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
        renderMenu(); // Ensure menu is rendered after scan
        btn.textContent = '[ Demo: Click to Scan ]';
    }, 1000);
}

// ===================================
// Existing AR Interaction (Refined)
// ===================================

function initARInteraction() {
    const scene = document.querySelector('#ar-scene');
    const reticle = document.getElementById('reticle');
    const container = document.getElementById('model-container');
    const instruction = document.getElementById('placement-instruction');

    scene.addEventListener('click', () => {
        if (AppState.selectedFood && !AppState.isPlaced && reticle.getAttribute('visible')) {
            // Place Model at Reticle Position
            container.setAttribute('position', reticle.getAttribute('position'));
            container.setAttribute('visible', 'true');
            AppState.isPlaced = true;

            // Hide reticle and instruction
            reticle.setAttribute('visible', 'false');
            instruction.classList.add('hidden');

            console.log('✅ Model Placed');
        }
    });

    // Simple Reticle Follower (in a real app we'd use hit-test, 
    // but for AR.js/A-Frame we simulate a 'distance-based' placement for stability)
    setInterval(() => {
        if (AppState.selectedFood && !AppState.isPlaced && AppState.currentSection === 'ar-view') {
            reticle.setAttribute('visible', 'true');
            // Mock placement stability (centered on ground-ish)
            reticle.setAttribute('position', '0 -1 -2');
        } else {
            reticle.setAttribute('visible', 'false'); // Hide reticle if not in AR view or placed
        }
    }, 100);
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

// Removed old selectFood as its functionality is now split between openPreview and enterARMode

function loadARModel(food) {
    const model = document.getElementById('ar-model');
    if (!model) return;

    model.setAttribute('gltf-model', food.model);
    model.setAttribute('scale', food.scale);
    model.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 20000,
        easing: 'linear'
    });
}

function startNutritionalAnimations(food) {
    AppState.typingIntervals.forEach(clearInterval);
    AppState.typingIntervals = [];

    typeEffect(document.getElementById('protein-value'), food.protein);
    typeEffect(document.getElementById('carbs-value'), food.carbs);
    typeEffect(document.getElementById('fiber-value'), food.fiber); // Added fiber

    const container = document.getElementById('ingredients-container');
    container.innerHTML = '';
    food.ingredients.forEach((ing, index) => {
        const li = document.createElement('li');
        container.appendChild(li);
        setTimeout(() => typeEffect(li, ing, 50), index * 600 + 800);
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
