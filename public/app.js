/**
 * WebAR Menu - Md Modassir Hussain
 * "We show you reality so you do not pay for fake food."
 */

// ========== FOOD DATA WITH IMAGES ==========
const FOOD_DATA = {
    // North Indian (Using local 3D models)
    'butter-chicken': { name: 'Butter Chicken', price: 350, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800', model: '/models/burger.glb', scale: '0.5 0.5 0.5', protein: '32g', carbs: '12g', fiber: '2g', ingredients: ['Boneless Chicken', 'Tomato Purée', 'Fresh Cream', 'Butter', 'Kashmiri Mirch'] },
    'paneer-tikka': { name: 'Paneer Tikka', price: 280, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800', model: '/models/pizza.glb', scale: '0.5 0.5 0.5', protein: '18g', carbs: '8g', fiber: '3g', ingredients: ['Paneer cubes', 'Yogurt', 'Bell Peppers', 'Tandoori Masala'] },
    'dal-makhani': { name: 'Dal Makhani', price: 220, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', model: '/models/cake.glb', scale: '0.5 0.5 0.5', protein: '14g', carbs: '38g', fiber: '12g', ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Garlic'] },
    'garlic-naan': { name: 'Garlic Naan', price: 60, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', model: '/models/croissant.glb', scale: '0.5 0.5 0.5', protein: '8g', carbs: '45g', fiber: '2g', ingredients: ['Refined Flour', 'Fresh Garlic', 'Coriander'] },
    'veg-biryani': { name: 'Veg Biryani', price: 320, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', model: '/models/pizza (2).glb', scale: '0.5 0.5 0.5', protein: '12g', carbs: '65g', fiber: '8g', ingredients: ['Basmati Rice', 'Saffron', 'Vegetables', 'Mint'] },

    // Chinese
    'hakka-noodles': { name: 'Hakka Noodles', price: 240, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.35 0.35 0.35', protein: '10g', carbs: '55g', fiber: '4g', ingredients: ['Egg Noodles', 'Cabbage', 'Soy Sauce'] },
    'veg-manchurian': { name: 'Veg Manchurian', price: 220, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.3 0.3 0.3', protein: '9g', carbs: '28g', fiber: '6g', ingredients: ['Vegetable Balls', 'Ginger', 'Green Chilies'] },
    'chilli-chicken': { name: 'Chilli Chicken', price: 290, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.3 0.3 0.3', protein: '28g', carbs: '15g', fiber: '1g', ingredients: ['Chicken', 'Capsicum', 'Szechwan Sauce'] },
    'dim-sums': { name: 'Veg Dim Sums', price: 180, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.25 0.25 0.25', protein: '6g', carbs: '22g', fiber: '2g', ingredients: ['Water Chestnuts', 'Mushrooms', 'Wrappers'] },
    'spring-rolls': { name: 'Spring Rolls', price: 150, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.25 0.25 0.25', protein: '5g', carbs: '32g', fiber: '3g', ingredients: ['Thin Dough', 'Sprouts', 'Glass Noodles'] },

    // South Indian
    'masala-dosa': { name: 'Masala Dosa', price: 180, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.5 0.5 0.5', protein: '10g', carbs: '75g', fiber: '6g', ingredients: ['Rice Crepe', 'Potato Filling', 'Chutney'] },
    'idli-sambhar': { name: 'Idli Sambhar', price: 140, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.3 0.3 0.3', protein: '8g', carbs: '42g', fiber: '4g', ingredients: ['Rice Cakes', 'Lentil Stew', 'Tamarind'] },
    'medu-vada': { name: 'Medu Vada', price: 140, image: 'https://images.unsplash.com/photo-1626132647523-66f0bf380027?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.25 0.25 0.25', protein: '12g', carbs: '28g', fiber: '5g', ingredients: ['Black Gram', 'Peppercorns', 'Asafoetida'] },
    'onion-uttapam': { name: 'Onion Uttapam', price: 160, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.4 0.4 0.4', protein: '9g', carbs: '55g', fiber: '7g', ingredients: ['Thick Pancake', 'Onions', 'Ginger'] },
    'lemon-rice': { name: 'Lemon Rice', price: 160, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.35 0.35 0.35', protein: '7g', carbs: '68g', fiber: '4g', ingredients: ['Rice', 'Lemon Juice', 'Peanuts'] },

    // Desserts
    'gulab-jamun': { name: 'Gulab Jamun', price: 90, image: 'https://images.unsplash.com/photo-1571167530149-c6cdb0535c4c?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.25 0.25 0.25', protein: '4g', carbs: '48g', fiber: '1g', ingredients: ['Milk Solids', 'Sugar Syrup', 'Cardamom'] },
    'rasmalai': { name: 'Rasmalai', price: 110, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.25 0.25 0.25', protein: '8g', carbs: '32g', fiber: '1g', ingredients: ['Chenna', 'Thickened Milk', 'Saffron'] },
    'kulfi': { name: 'Kesar Kulfi', price: 80, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.25 0.25 0.25', protein: '6g', carbs: '28g', fiber: '1g', ingredients: ['Milk', 'Saffron', 'Crushed Nuts'] },
    'brownie': { name: 'Choco Brownie', price: 140, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.3 0.3 0.3', protein: '5g', carbs: '42g', fiber: '3g', ingredients: ['Chocolate', 'Cocoa', 'Walnuts'] },
    'ice-cream': { name: 'Premium Vanilla', price: 70, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', scale: '0.3 0.3 0.3', protein: '4g', carbs: '25g', fiber: '0g', ingredients: ['Fresh Cream', 'Vanilla', 'Milk'] }
};

// ========== APP STATE ==========
let currentFood = null;
let plateQty = 1;
let cameraStream = null;
let arStream = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🍽️ WebAR Menu Starting...');
    await startCamera();
});

// ========== CAMERA START ==========
async function startCamera() {
    try {
        const video = document.getElementById('scanner-video');
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });

        video.srcObject = cameraStream;
        await video.play();
        console.log('✅ Camera started');
        document.getElementById('camera-scanner').classList.remove('hidden');

    } catch (err) {
        console.error('❌ Camera error:', err);
        alert('Camera access required. Please allow camera permission and reload.');
    }
}

// ========== BROWSER BACK BUTTON HANDLER ==========
window.addEventListener('popstate', function (event) {
    // If AR is open, close it and show dish detail or menu
    const arView = document.getElementById('ar-view');
    if (!arView.classList.contains('hidden')) {
        const videoElement = document.getElementById('ar-camera-video');
        if (videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }
        document.getElementById('ar-camera-container').style.display = 'none';
        arView.classList.add('hidden');

        // Show dish detail if we have currentFood, otherwise menu
        if (currentFood) {
            showDishDetail(Object.keys(FOOD_DATA).find(key => FOOD_DATA[key] === currentFood));
        } else {
            hideAllScreens();
            document.getElementById('menu-screen').classList.remove('hidden');
        }
        return;
    }

    // Normal navigation - show appropriate screen based on hash
    const hash = window.location.hash.substring(1);
    if (hash && hash !== 'ar') {
        hideAllScreens();
        document.getElementById(hash).classList.remove('hidden');
    } else if (!hash) {
        // No hash means we're at the start - show menu
        hideAllScreens();
        document.getElementById('menu-screen').classList.remove('hidden');
    }
});

// ========== QR SCAN SIMULATION ==========
function simulateQRScan() {
    const btn = document.querySelector('.btn-demo-scan');
    btn.textContent = 'Scanning...';
    btn.disabled = true;

    setTimeout(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }

        document.getElementById('camera-scanner').classList.add('hidden');
        document.getElementById('hamburger-btn').classList.remove('hidden');
        showSection('menu-screen');

        btn.textContent = '[ Demo: Simulate Scan ]';
        btn.disabled = false;
    }, 1500);
}

// ========== NAVIGATION ==========
function showScanner() {
    hideAllScreens();
    document.getElementById('camera-scanner').classList.remove('hidden');
    document.getElementById('hamburger-btn').classList.add('hidden');
    startCamera();
}

function showSection(sectionId) {
    hideAllScreens();
    document.getElementById(sectionId).classList.remove('hidden');

    // Add to browser history (except for scanner)
    if (sectionId !== 'camera-scanner') {
        window.history.pushState({ page: sectionId }, '', `#${sectionId}`);
    }
}

function hideAllScreens() {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.add('hidden'));
    document.getElementById('ar-view').classList.add('hidden');
    document.getElementById('dish-detail').classList.add('hidden');
}

// ========== DISH DETAIL PAGE ==========
function showDishDetail(foodId) {
    const food = FOOD_DATA[foodId];
    if (!food) return;

    currentFood = food;

    // Update detail page
    document.getElementById('detail-dish-image').src = food.image;
    document.getElementById('detail-dish-name').textContent = food.name;
    document.getElementById('detail-dish-price').textContent = `₹${food.price}`;
    document.getElementById('detail-protein').textContent = food.protein;
    document.getElementById('detail-carbs').textContent = food.carbs;
    document.getElementById('detail-fiber').textContent = food.fiber;

    // Ingredients
    const ingredientsList = document.getElementById('detail-ingredients-list');
    ingredientsList.innerHTML = '';
    food.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        ingredientsList.appendChild(li);
    });

    // Show detail page
    hideAllScreens();
    document.getElementById('dish-detail').classList.remove('hidden');
}

// ========== AR VIEW WITH WORKING CAMERA ==========
async function openARView() {
    if (!currentFood) return;

    plateQty = 1;

    // Update AR UI
    document.getElementById('ar-dish-name').textContent = currentFood.name;
    document.getElementById('ar-protein').textContent = currentFood.protein;
    document.getElementById('ar-carbs').textContent = currentFood.carbs;
    document.getElementById('ar-fiber').textContent = currentFood.fiber;
    document.getElementById('plate-qty').textContent = plateQty;

    // Ingredients
    const ingredientsList = document.getElementById('ar-ingredients-list');
    ingredientsList.innerHTML = '';
    currentFood.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        ingredientsList.appendChild(li);
    });

    // Show loading screen IMMEDIATELY
    document.getElementById('ar-loading').classList.remove('hidden');
    document.getElementById('ar-loading').style.display = 'flex';

    // Hide all screens
    hideAllScreens();

    // Show AR view overlay
    document.getElementById('ar-view').classList.remove('hidden');

    // Add to browser history for back button
    window.history.pushState({ page: 'ar' }, '', '#ar');

    // Start camera and show 3D model
    await startARCameraAndModel();
}

async function startARCameraAndModel() {
    try {
        const cameraContainer = document.getElementById('ar-camera-container');
        const videoElement = document.getElementById('ar-camera-video');
        const modelViewer = document.getElementById('ar-3d-model');
        const loadingScreen = document.getElementById('ar-loading');

        // Request back camera
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });

        // Set video source to camera stream
        videoElement.srcObject = stream;
        await videoElement.play();

        // Load 3D model into model-viewer
        modelViewer.src = currentFood.model;

        // Show camera container
        cameraContainer.style.display = 'block';

        // Hide loading screen after camera starts
        loadingScreen.classList.add('hidden');
        loadingScreen.style.display = 'none';

        console.log('✅ AR Camera started with model:', currentFood.model);

    } catch (error) {
        console.error('❌ AR Camera error:', error);
        document.getElementById('ar-loading').classList.add('hidden');
        document.getElementById('ar-loading').style.display = 'none';
        alert('Camera access required for AR. Please allow camera permission.');
    }
}

function closeAR() {
    // Stop camera
    const videoElement = document.getElementById('ar-camera-video');
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }

    // Hide camera container
    document.getElementById('ar-camera-container').style.display = 'none';

    // Hide AR view
    document.getElementById('ar-view').classList.add('hidden');

    // Show menu directly
    hideAllScreens();
    document.getElementById('menu-screen').classList.remove('hidden');
}

function backToDishDetail() {
    // Stop camera
    const videoElement = document.getElementById('ar-camera-video');
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }

    // Hide camera container
    document.getElementById('ar-camera-container').style.display = 'none';

    // Hide AR view
    document.getElementById('ar-view').classList.add('hidden');

    // Show dish detail directly
    if (currentFood) {
        showDishDetail(Object.keys(FOOD_DATA).find(key => FOOD_DATA[key] === currentFood));
    } else {
        hideAllScreens();
        document.getElementById('menu-screen').classList.remove('hidden');
    }
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

    trackEvent({ action: 'order', item: currentFood.name, quantity: plateQty });
}

// ========== FEEDBACK WITH RATING ==========
function submitFeedback() {
    const rating = document.querySelector('input[name="rating"]:checked');
    if (!rating) {
        alert('Please select a star rating');
        return;
    }
    alert(`Thank you for your ${rating.value}-star feedback! 🙏`);
    showScanner();
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
window.showScanner = showScanner;
window.showSection = showSection;
window.simulateQRScan = simulateQRScan;
window.showDishDetail = showDishDetail;
window.openARView = openARView;
window.closeAR = closeAR;
window.backToDishDetail = backToDishDetail;
window.changeQty = changeQty;
window.placeOrder = placeOrder;
window.submitFeedback = submitFeedback;
