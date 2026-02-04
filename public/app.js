/**
 * Premium WebAR Restaurant - Core Logic
 */

const FOOD_DATA = {
    // --- North Indian ---
    'butter-chicken': {
        name: 'Butter Chicken',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', // Placeholder
        scale: '0.1 0.1 0.1',
        protein: '32g',
        carbs: '12g',
        fiber: '2g',
        ingredients: ['Boneless Chicken', 'Tomato Purée', 'Fresh Cream', 'Butter', 'Kashmiri Mirch']
    },
    'paneer-tikka': {
        name: 'Paneer Tikka',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.1 0.1 0.1',
        protein: '18g',
        carbs: '8g',
        fiber: '3g',
        ingredients: ['Paneer cubes', 'Yogurt', 'Bell Peppers', 'Tandoori Masala', 'Lemon']
    },
    'dal-makhani': {
        name: 'Dal Makhani',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.12 0.12 0.12',
        protein: '14g',
        carbs: '38g',
        fiber: '12g',
        ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Garlic', 'Garam Masala']
    },
    'garlic-naan': {
        name: 'Garlic Naan',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.1 0.1 0.1',
        protein: '8g',
        carbs: '45g',
        fiber: '2g',
        ingredients: ['Refined Flour', 'Fresh Garlic', 'Coriander', 'Nigella Seeds']
    },
    'veg-biryani': {
        name: 'Veg Biryani',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.15 0.15 0.15',
        protein: '12g',
        carbs: '65g',
        fiber: '8g',
        ingredients: ['Basmati Rice', 'Saffron', 'Assorted Veggies', 'Mint', 'Biryani Spice']
    },

    // --- Chinese ---
    'hakka-noodles': {
        name: 'Hakka Noodles',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.12 0.12 0.12',
        protein: '10g',
        carbs: '55g',
        fiber: '4g',
        ingredients: ['Egg Noodles', 'Cabbage', 'Soy Sauce', 'Spring Onions', 'Vinegar']
    },
    'veg-manchurian': {
        name: 'Veg Manchurian',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.1 0.1 0.1',
        protein: '9g',
        carbs: '28g',
        fiber: '6g',
        ingredients: ['Vegetable Balls', 'Ginger', 'Green Chilies', 'Celery', 'Manchurian Sauce']
    },
    'chilli-chicken': {
        name: 'Chilli Chicken',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.1 0.1 0.1',
        protein: '28g',
        carbs: '15g',
        fiber: '1g',
        ingredients: ['Chicken Thighs', 'Capsicum', 'Szechwan Sauce', 'Dry Whole Red Chilies']
    },
    'dim-sums': {
        name: 'Veg Dim Sums',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.08 0.08 0.08',
        protein: '6g',
        carbs: '22g',
        fiber: '2g',
        ingredients: ['Water Chestnuts', 'Mushrooms', 'Translucent Wrappers', 'Sesame Oil']
    },
    'spring-rolls': {
        name: 'Spring Rolls',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.08 0.08 0.08',
        protein: '5g',
        carbs: '32g',
        fiber: '3g',
        ingredients: ['Paper-thin Dough', 'Shredded Sprouts', 'Glass Noodles', 'Sweet Chilli Dip']
    },

    // --- South Indian ---
    'masala-dosa': {
        name: 'Masala Dosa',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.2 0.2 0.2',
        protein: '10g',
        carbs: '75g',
        fiber: '6g',
        ingredients: ['Fermented Rice Crepe', 'Spiced Potato Filling', 'Coconut Chutney', 'Sambar']
    },
    'idli-sambhar': {
        name: 'Idli Sambhar',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.1 0.1 0.1',
        protein: '8g',
        carbs: '42g',
        fiber: '4g',
        ingredients: ['Steamed Rice Cakes', 'Lentil Stew', 'Curry Leaves', 'Tamarind']
    },
    'medu-vada': {
        name: 'Medu Vada',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.08 0.08 0.08',
        protein: '12g',
        carbs: '28g',
        fiber: '5g',
        ingredients: ['Black Gram Lentils', 'Peppercorns', 'Asafoetida', 'Green Chilies']
    },
    'onion-uttapam': {
        name: 'Onion Uttapam',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.15 0.15 0.15',
        protein: '9g',
        carbs: '55g',
        fiber: '7g',
        ingredients: ['Thick Pancake', 'Sautéed Onions', 'Ginger', 'Green Chillies']
    },
    'lemon-rice': {
        name: 'Lemon Rice',
        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        scale: '0.12 0.12 0.12',
        protein: '7g',
        carbs: '68g',
        fiber: '4g',
        ingredients: ['Pre-cooked Rice', 'Fresh Lemon Juice', 'Peanuts', 'Mustard Seeds', 'Turmeric']
    }
};

const AppState = {
    selectedFood: null,
    isCameraEnabled: false,
    typingIntervals: []
};

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍽️ Premium Restaurant AR Starting...');
    setupARScene();
});

function setupARScene() {
    // AR.js initialization is handled by attributes, but we can nudge it
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        onSceneLoaded();
    } else {
        scene.addEventListener('loaded', onSceneLoaded);
    }
}

function onSceneLoaded() {
    console.log('✅ AR Scene Ready');
    // Ensure camera entity is active
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
    // We do this via the A-Frame start-up or manual nudge
    if (!AppState.isCameraEnabled) {
        const granted = await requestCameraPermission();
        if (!granted) return;
    }

    // 2. Load Model & Data
    loadARModel(food);

    // 3. Switch View
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('ar-ui').classList.remove('hidden');

    // 4. Start Animations
    startNutritionalAnimations(food);

    // Track Engagement
    trackEvent({ action: 'view_food', item: foodId });
}

async function requestCameraPermission() {
    try {
        // Triggering getUserMedia manually helps on some browsers to "wake up" the camera hardware
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        AppState.isCameraEnabled = true;

        // Refresh AR.js system
        const scene = document.querySelector('a-scene');
        scene.setAttribute('arjs', 'sourceType: webcam; videoTexture: true;');

        return true;
    } catch (err) {
        console.error('Camera denied:', err);
        alert('Please allow camera access to experience the food in AR.');
        return false;
    }
}

function loadARModel(food) {
    const model = document.getElementById('ar-model');
    if (!model) return;

    // Use a high-quality model or user-provided one
    model.setAttribute('gltf-model', food.model);
    model.setAttribute('scale', food.scale);

    // Subtle rotation
    model.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 15000,
        easing: 'linear'
    });
}

function startNutritionalAnimations(food) {
    // Clear previous typing intervals
    AppState.typingIntervals.forEach(clearInterval);
    AppState.typingIntervals = [];

    // Type Protein
    typeEffect(document.getElementById('protein-value'), food.protein);
    // Type Carbs
    typeEffect(document.getElementById('carbs-value'), food.carbs);
    // Type Fiber
    typeEffect(document.getElementById('fiber-value'), food.fiber);

    // Type ingredients with a delay between each
    const ingredientsList = document.getElementById('ingredients-container');
    ingredientsList.innerHTML = '';

    food.ingredients.forEach((ing, index) => {
        const li = document.createElement('li');
        ingredientsList.appendChild(li);

        setTimeout(() => {
            typeEffect(li, ing, 50); // Slightly faster for list items
        }, index * 800 + 1000); // Stagger by 800ms, start after nutrition typing
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
    }, 100);

    AppState.typingIntervals.push(interval);
}

function goBackToMenu() {
    document.getElementById('menu-screen').classList.remove('hidden');
    document.getElementById('ar-ui').classList.add('hidden');

    // Stop typing
    AppState.typingIntervals.forEach(clearInterval);

    // Clear model to save resources
    const model = document.getElementById('ar-model');
    if (model) model.removeAttribute('gltf-model');
}

function placeOrder() {
    const food = AppState.selectedFood;
    if (!food) return;

    const orderBtn = document.querySelector('.btn-order-now');
    orderBtn.textContent = 'Preparing... 🍴';
    orderBtn.style.background = '#10b981';

    trackEvent({ action: 'add_to_cart', item: food.name });

    setTimeout(() => {
        orderBtn.textContent = 'Order Placed!';
        setTimeout(() => {
            orderBtn.textContent = 'Order Now';
            orderBtn.style.background = 'var(--primary-gold)';
        }, 2000);
    }, 1500);
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
