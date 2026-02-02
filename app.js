/**
 * WebAR Application - Core Logic
 * 
 * This file handles:
 * - Device capability detection
 * - WebXR session management
 * - 3D model loading and optimization
 * - Touch gesture controls
 * - Error handling and fallbacks
 * - Performance monitoring
 */

// ===================================
// Global State Management
// ===================================

const AppState = {
    isARSupported: false,
    isARActive: false,
    modelLoaded: false,
    currentModel: null,
    performanceMode: 'high', // high, medium, low
    debugMode: false, // Set to true to show performance monitor
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    loadingScreen: null,
    permissionScreen: null,
    errorScreen: null,
    unsupportedScreen: null,
    arScene: null,
    arModel: null,
    arControls: null,
    performanceMonitor: null,
};

// ===================================
// Configuration
// ===================================

const CONFIG = {
    // ========================================
    // 3D MODEL CONFIGURATION
    // ========================================
    // 
    // TO USE YOUR OWN MODEL:
    // 1. Download a .glb file from Sketchfab or Poly Pizza
    // 2. Place it in the 'models/' folder
    // 3. Uncomment the line below and update the filename
    // 4. Comment out the defaultModel line
    //
    // Example:
    // defaultModel: './models/your-model.glb',

    // Current model (CDN-hosted astronaut)
    defaultModel: 'https://cdn.glitch.global/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?v=1599849238130',

    // Alternative models for testing
    models: {
        astronaut: 'https://cdn.glitch.global/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?v=1599849238130',
        // Add your own models here:
        // robot: './models/robot.glb',
        // car: './models/car.glb',
        // furniture: './models/chair.glb',
    },

    // Model positioning and scale
    // Adjust these if your model appears too big/small or in wrong position
    modelDefaults: {
        position: { x: 0, y: 0, z: -3 },  // z: -3 means 3 meters away
        rotation: { x: 0, y: 0, z: 0 },   // Rotation in degrees
        scale: { x: 1, y: 1, z: 1 },      // 1 = original size, 0.5 = half, 2 = double
    },

    // Performance thresholds
    performance: {
        targetFPS: 60,
        minFPS: 30,
        memoryWarningMB: 200,
    },
};

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 WebAR Application Starting...');

    // Cache DOM elements
    cacheElements();

    // Setup event listeners
    setupEventListeners();

    // Check device capabilities
    checkDeviceCapabilities();

    // Initialize performance monitoring if debug mode
    if (AppState.debugMode) {
        initPerformanceMonitor();
    }
});

/**
 * Cache all DOM elements for performance
 */
function cacheElements() {
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.permissionScreen = document.getElementById('permission-screen');
    elements.errorScreen = document.getElementById('error-screen');
    elements.unsupportedScreen = document.getElementById('unsupported-screen');
    elements.arScene = document.getElementById('ar-scene');
    elements.arModel = document.getElementById('ar-model');
    elements.arControls = document.getElementById('ar-controls');
    elements.performanceMonitor = document.getElementById('performance-monitor');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Permission button
    const grantPermissionBtn = document.getElementById('grant-permission-btn');
    if (grantPermissionBtn) {
        grantPermissionBtn.addEventListener('click', handlePermissionGrant);
    }

    // Error screen buttons
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => location.reload());
    }

    const fallbackBtn = document.getElementById('fallback-btn');
    if (fallbackBtn) {
        fallbackBtn.addEventListener('click', showFallback3DViewer);
    }

    const view3DBtn = document.getElementById('view-3d-btn');
    if (view3DBtn) {
        view3DBtn.addEventListener('click', showFallback3DViewer);
    }

    // AR control buttons
    const exitARBtn = document.getElementById('exit-ar-btn');
    if (exitARBtn) {
        exitARBtn.addEventListener('click', exitAR);
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetModelPosition);
    }

    const screenshotBtn = document.getElementById('screenshot-btn');
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', captureScreenshot);
    }

    // A-Frame scene events
    if (elements.arScene) {
        elements.arScene.addEventListener('loaded', onSceneLoaded);
        elements.arScene.addEventListener('enter-vr', onEnterAR);
        elements.arScene.addEventListener('exit-vr', onExitAR);
    }

    // Model loading events
    if (elements.arModel) {
        elements.arModel.addEventListener('model-loaded', onModelLoaded);
        elements.arModel.addEventListener('model-error', onModelError);
    }
}

// ===================================
// Device Capability Detection
// ===================================

/**
 * Check if the device supports WebXR and AR
 */
async function checkDeviceCapabilities() {
    console.log('🔍 Checking device capabilities...');

    try {
        // Check for WebXR support
        if (!navigator.xr) {
            console.warn('❌ WebXR not supported');
            showUnsupportedScreen();
            return;
        }

        // Check for immersive-ar mode support
        const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');

        if (isARSupported) {
            console.log('✅ AR is supported!');
            AppState.isARSupported = true;

            // Detect device performance tier
            detectPerformanceTier();

            // Load the 3D model
            loadModel();
        } else {
            console.warn('❌ Immersive AR not supported');
            showUnsupportedScreen();
        }
    } catch (error) {
        console.error('Error checking capabilities:', error);

        // Fallback: Try to initialize anyway (for AR.js marker-based AR)
        console.log('⚠️ Falling back to marker-based AR...');
        AppState.isARSupported = true;
        loadModel();
    }
}

/**
 * Detect device performance tier for optimization
 */
function detectPerformanceTier() {
    const memory = navigator.deviceMemory || 4; // GB
    const cores = navigator.hardwareConcurrency || 4;

    if (memory >= 6 && cores >= 6) {
        AppState.performanceMode = 'high';
        console.log('📊 Performance: HIGH');
    } else if (memory >= 4 && cores >= 4) {
        AppState.performanceMode = 'medium';
        console.log('📊 Performance: MEDIUM');
    } else {
        AppState.performanceMode = 'low';
        console.log('📊 Performance: LOW - Optimizations enabled');
    }
}

// ===================================
// 3D Model Loading
// ===================================

/**
 * Load the 3D model into the scene
 */
function loadModel() {
    console.log('📦 Loading 3D model...');

    const modelURL = CONFIG.defaultModel;

    if (!elements.arModel) {
        console.error('AR model element not found');
        showError('Model Loading Failed', 'Could not find model container.');
        return;
    }

    // Set the model source
    elements.arModel.setAttribute('gltf-model', modelURL);

    // Apply default transformations
    elements.arModel.setAttribute('position',
        `${CONFIG.modelDefaults.position.x} ${CONFIG.modelDefaults.position.y} ${CONFIG.modelDefaults.position.z}`
    );

    elements.arModel.setAttribute('scale',
        `${CONFIG.modelDefaults.scale.x} ${CONFIG.modelDefaults.scale.y} ${CONFIG.modelDefaults.scale.z}`
    );

    // Optimize based on performance tier
    if (AppState.performanceMode === 'low') {
        // Reduce quality for low-end devices
        elements.arModel.setAttribute('scale', '0.8 0.8 0.8');
    }
}

/**
 * Called when the model successfully loads
 */
function onModelLoaded(event) {
    console.log('✅ Model loaded successfully');
    AppState.modelLoaded = true;
    AppState.currentModel = event.target;

    // Hide loading screen, show permission screen
    hideElement(elements.loadingScreen);
    showElement(elements.permissionScreen);
}

/**
 * Called when model loading fails
 */
function onModelError(event) {
    console.error('❌ Model loading error:', event);
    showError('Model Loading Failed', 'Could not load the 3D model. Please check your connection and try again.');
}

// ===================================
// Camera Permission Handling
// ===================================

/**
 * Handle camera permission grant
 */
async function handlePermissionGrant() {
    console.log('📷 Requesting camera permission...');

    try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        console.log('✅ Camera permission granted');

        // Stop the stream (A-Frame will handle it)
        stream.getTracks().forEach(track => track.stop());

        // Hide permission screen
        hideElement(elements.permissionScreen);

        // Start AR experience
        startARExperience();

    } catch (error) {
        console.error('❌ Camera permission denied:', error);
        showError(
            'Camera Access Denied',
            'Please enable camera access in your browser settings to use AR.'
        );
    }
}

// ===================================
// AR Session Management
// ===================================

/**
 * Start the AR experience
 */
function startARExperience() {
    console.log('🎯 Starting AR experience...');

    // Show AR controls
    showElement(elements.arControls);

    // Mark AR as active
    AppState.isARActive = true;

    // The A-Frame scene is already running, just make sure it's visible
    if (elements.arScene) {
        elements.arScene.style.display = 'block';
    }

    console.log('✅ AR experience started');
}

/**
 * Called when scene is fully loaded
 */
function onSceneLoaded() {
    console.log('✅ A-Frame scene loaded');
}

/**
 * Called when entering AR mode
 */
function onEnterAR() {
    console.log('🎯 Entered AR mode');
    AppState.isARActive = true;
}

/**
 * Called when exiting AR mode
 */
function onExitAR() {
    console.log('👋 Exited AR mode');
    AppState.isARActive = false;
}

/**
 * Exit AR and return to initial state
 */
function exitAR() {
    console.log('🚪 Exiting AR...');

    // Hide AR controls
    hideElement(elements.arControls);

    // Reset state
    AppState.isARActive = false;

    // Show permission screen again
    showElement(elements.permissionScreen);
}

// ===================================
// AR Interactions
// ===================================

/**
 * Reset model to default position and scale
 */
function resetModelPosition() {
    console.log('🔄 Resetting model position...');

    if (!elements.arModel) return;

    // Animate back to default position
    elements.arModel.setAttribute('animation', {
        property: 'position',
        to: `${CONFIG.modelDefaults.position.x} ${CONFIG.modelDefaults.position.y} ${CONFIG.modelDefaults.position.z}`,
        dur: 500,
        easing: 'easeInOutQuad'
    });

    elements.arModel.setAttribute('animation__scale', {
        property: 'scale',
        to: `${CONFIG.modelDefaults.scale.x} ${CONFIG.modelDefaults.scale.y} ${CONFIG.modelDefaults.scale.z}`,
        dur: 500,
        easing: 'easeInOutQuad'
    });

    elements.arModel.setAttribute('animation__rotation', {
        property: 'rotation',
        to: `${CONFIG.modelDefaults.rotation.x} ${CONFIG.modelDefaults.rotation.y} ${CONFIG.modelDefaults.rotation.z}`,
        dur: 500,
        easing: 'easeInOutQuad'
    });
}

/**
 * Capture a screenshot of the AR experience
 */
function captureScreenshot() {
    console.log('📸 Capturing screenshot...');

    if (!elements.arScene) return;

    try {
        const canvas = elements.arScene.components.screenshot.getCanvas('perspective');

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `webar-capture-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);

            console.log('✅ Screenshot saved');
        });
    } catch (error) {
        console.error('❌ Screenshot failed:', error);

        // Fallback: Use A-Frame's built-in screenshot
        elements.arScene.components.screenshot.capture('perspective');
    }
}

// ===================================
// Fallback 3D Viewer
// ===================================

/**
 * Show a fallback 3D viewer for unsupported devices
 */
function showFallback3DViewer() {
    console.log('🔄 Switching to fallback 3D viewer...');

    // Hide all overlay screens
    hideElement(elements.errorScreen);
    hideElement(elements.unsupportedScreen);
    hideElement(elements.permissionScreen);

    // Show the scene without AR
    if (elements.arScene) {
        elements.arScene.style.display = 'block';

        // Disable AR mode, enable regular 3D viewing
        elements.arScene.setAttribute('vr-mode-ui', 'enabled: false');

        // Enable camera controls for 3D viewing
        const camera = elements.arScene.querySelector('[camera]');
        if (camera) {
            camera.setAttribute('look-controls', 'enabled: true');
            camera.setAttribute('wasd-controls', 'enabled: true');
        }
    }

    // Show basic controls
    showElement(elements.arControls);

    console.log('✅ Fallback viewer active');
}

// ===================================
// Error Handling
// ===================================

/**
 * Show error screen with custom message
 */
function showError(title, message) {
    const errorTitle = document.getElementById('error-title');
    const errorMessage = document.getElementById('error-message');

    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;

    hideElement(elements.loadingScreen);
    hideElement(elements.permissionScreen);
    showElement(elements.errorScreen);
}

/**
 * Show unsupported browser screen
 */
function showUnsupportedScreen() {
    hideElement(elements.loadingScreen);
    showElement(elements.unsupportedScreen);
}

// ===================================
// Performance Monitoring
// ===================================

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitor() {
    if (!AppState.debugMode) return;

    showElement(elements.performanceMonitor);

    let lastTime = performance.now();
    let frames = 0;

    function updateStats() {
        frames++;
        const currentTime = performance.now();

        if (currentTime >= lastTime + 1000) {
            // Update FPS
            const fps = Math.round((frames * 1000) / (currentTime - lastTime));
            const fpsCounter = document.getElementById('fps-counter');
            if (fpsCounter) {
                fpsCounter.textContent = fps;
                fpsCounter.style.color = fps >= 30 ? '#10b981' : '#ef4444';
            }

            // Update memory (if available)
            if (performance.memory) {
                const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
                const memoryCounter = document.getElementById('memory-counter');
                if (memoryCounter) {
                    memoryCounter.textContent = `${memoryMB} MB`;
                    memoryCounter.style.color = memoryMB < 200 ? '#10b981' : '#f59e0b';
                }
            }

            frames = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(updateStats);
    }

    updateStats();
}

// ===================================
// Utility Functions
// ===================================

/**
 * Show an element
 */
function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
    }
}

/**
 * Hide an element
 */
function hideElement(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Log app state (for debugging)
 */
function logAppState() {
    console.log('📊 App State:', AppState);
}

// ===================================
// Export for debugging (optional)
// ===================================

if (typeof window !== 'undefined') {
    window.WebARApp = {
        state: AppState,
        config: CONFIG,
        resetModel: resetModelPosition,
        captureScreenshot: captureScreenshot,
        logState: logAppState,
    };
}

console.log('✅ WebAR Application Initialized');
