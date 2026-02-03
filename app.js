/**
 * ============================================
 * WEBAR EXPERIENCE - MAIN APPLICATION
 * ============================================
 * 
 * Production-ready WebAR platform using:
 * - A-Frame for WebXR/AR scene management
 * - Three.js for advanced 3D rendering
 * - Custom gesture handlers for mobile touch
 * - GLB/GLTF model loading with USDZ fallback
 * - Screenshot capture and sharing
 * - Comprehensive device compatibility checks
 * 
 * @author WebAR Platform Team
 * @version 1.0.0
 */

// ============================================
// GLOBAL STATE MANAGEMENT
// ============================================

const AppState = {
    isARSupported: false,
    isARActive: false,
    cameraPermissionGranted: false,
    currentModel: 'model-1',
    modelPlaced: false,
    scene: null,
    camera: null,
    modelContainer: null,
    models: {},
    loadingProgress: 0
};

// ============================================
// DEVICE & BROWSER DETECTION
// ============================================

class DeviceDetector {
    /**
     * Comprehensive device and browser detection
     * Checks for WebXR support, browser compatibility, and device capabilities
     */
    constructor() {
        this.userAgent = navigator.userAgent || navigator.vendor || window.opera;
        this.platform = navigator.platform;
    }

    // Check if device is iOS
    isIOS() {
        return /iPad|iPhone|iPod/.test(this.userAgent) && !window.MSStream;
    }

    // Check if device is Android
    isAndroid() {
        return /android/i.test(this.userAgent);
    }

    // Check if browser is Safari
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(this.userAgent);
    }

    // Check if browser is Chrome
    isChrome() {
        return /chrome|chromium|crios/i.test(this.userAgent) && !/edge|edg/i.test(this.userAgent);
    }

    // Get detailed device information
    getDeviceInfo() {
        return {
            platform: this.platform,
            userAgent: this.userAgent,
            isIOS: this.isIOS(),
            isAndroid: this.isAndroid(),
            isSafari: this.isSafari(),
            isChrome: this.isChrome(),
            isMobile: this.isIOS() || this.isAndroid(),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
        };
    }

    // Check WebXR support
    async checkWebXRSupport() {
        if (!navigator.xr) {
            console.warn('WebXR not supported');
            return false;
        }

        try {
            // Check for immersive-ar support
            const supported = await navigator.xr.isSessionSupported('immersive-ar');
            console.log('WebXR AR Support:', supported);
            return supported;
        } catch (error) {
            console.error('Error checking WebXR support:', error);
            return false;
        }
    }

    // Check camera access availability
    async checkCameraAccess() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasCamera = devices.some(device => device.kind === 'videoinput');
            console.log('Camera available:', hasCamera);
            return hasCamera;
        } catch (error) {
            console.error('Error checking camera:', error);
            return false;
        }
    }
}

// ============================================
// AR SESSION MANAGER
// ============================================

class ARSessionManager {
    constructor() {
        this.session = null;
        this.device = new DeviceDetector();
    }

    /**
     * Initialize AR session with camera permissions
     * Handles iOS and Android differently for optimal compatibility
     */
    async initializeSession() {
        const deviceInfo = this.device.getDeviceInfo();
        
        updateLoadingMessage('Checking device compatibility...');
        updateLoadingProgress(20);

        // Check if device supports WebXR
        const webXRSupported = await this.device.checkWebXRSupport();
        const cameraAvailable = await this.device.checkCameraAccess();

        if (!webXRSupported && !cameraAvailable) {
            showFallbackScreen(deviceInfo);
            return false;
        }

        updateLoadingMessage('Requesting camera access...');
        updateLoadingProgress(40);

        // Request camera permissions
        const permissionGranted = await this.requestCameraPermission();
        
        if (!permissionGranted) {
            showPermissionScreen();
            return false;
        }

        updateLoadingMessage('Loading AR environment...');
        updateLoadingProgress(60);

        AppState.isARSupported = true;
        AppState.cameraPermissionGranted = true;

        return true;
    }

    /**
     * Request camera permissions with proper error handling
     */
    async requestCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            // Stop the stream immediately, we just needed permission
            stream.getTracks().forEach(track => track.stop());
            
            console.log('Camera permission granted');
            return true;
        } catch (error) {
            console.error('Camera permission denied:', error);
            return false;
        }
    }

    /**
     * Start AR session with A-Frame
     */
    async startARSession() {
        try {
            updateLoadingMessage('Initializing AR scene...');
            updateLoadingProgress(80);

            // Wait for A-Frame scene to be ready
            const scene = document.querySelector('#ar-scene');
            
            if (scene.hasLoaded) {
                await this.onSceneReady();
            } else {
                scene.addEventListener('loaded', () => this.onSceneReady());
            }

            return true;
        } catch (error) {
            console.error('Error starting AR session:', error);
            showToast('Failed to start AR session');
            return false;
        }
    }

    /**
     * Handle scene ready event
     */
    async onSceneReady() {
        updateLoadingMessage('AR Ready!');
        updateLoadingProgress(100);

        // Short delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));

        // Initialize scene references
        AppState.scene = document.querySelector('#ar-scene');
        AppState.camera = document.querySelector('#main-camera');
        AppState.modelContainer = document.querySelector('#model-container');

        // Cache model references
        AppState.models['model-1'] = document.querySelector('#model-1');
        AppState.models['model-2'] = document.querySelector('#model-2');

        // Hide loading, show AR scene and controls
        hideLoadingScreen();
        showARScene();
        showUIControls();

        AppState.isARActive = true;

        // Show instructions for first-time users
        setTimeout(() => {
            document.getElementById('instructions-panel').style.display = 'block';
            setTimeout(() => {
                document.getElementById('instructions-panel').style.display = 'none';
            }, 5000);
        }, 1000);
    }
}

// ============================================
// GESTURE HANDLER COMPONENT
// ============================================

/**
 * Custom A-Frame component for advanced touch gestures
 * Handles: tap-to-place, pinch-to-scale, drag-to-move, two-finger-rotate
 */
AFRAME.registerComponent('gesture-detector', {
    schema: {
        enabled: { default: true }
    },

    init: function() {
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.touchStarted = false;
        this.touches = [];
        
        const sceneEl = this.el.sceneEl;
        sceneEl.addEventListener('touchstart', this.handleTouchStart);
        sceneEl.addEventListener('touchmove', this.handleTouchMove);
        sceneEl.addEventListener('touchend', this.handleTouchEnd);
        sceneEl.addEventListener('touchcancel', this.handleTouchEnd);
    },

    handleTouchStart: function(event) {
        event.preventDefault();
        this.touchStarted = true;
        this.touches = Array.from(event.touches);
        
        // Emit custom event for gesture start
        this.el.emit('gesturestart', { touches: this.touches });
    },

    handleTouchMove: function(event) {
        event.preventDefault();
        if (!this.touchStarted) return;

        const touches = Array.from(event.touches);
        
        // Emit custom event for gesture move
        this.el.emit('gesturemove', {
            touches: touches,
            previousTouches: this.touches
        });

        this.touches = touches;
    },

    handleTouchEnd: function(event) {
        event.preventDefault();
        
        const remainingTouches = Array.from(event.touches);
        
        // Emit custom event for gesture end
        this.el.emit('gestureend', {
            touches: remainingTouches,
            previousTouches: this.touches
        });

        if (remainingTouches.length === 0) {
            this.touchStarted = false;
        }
        
        this.touches = remainingTouches;
    },

    remove: function() {
        const sceneEl = this.el.sceneEl;
        sceneEl.removeEventListener('touchstart', this.handleTouchStart);
        sceneEl.removeEventListener('touchmove', this.handleTouchMove);
        sceneEl.removeEventListener('touchend', this.handleTouchEnd);
        sceneEl.removeEventListener('touchcancel', this.handleTouchEnd);
    }
});

/**
 * Gesture handler for 3D model manipulation
 * Processes touch events and applies transformations
 */
AFRAME.registerComponent('gesture-handler', {
    schema: {
        enabled: { default: true },
        minScale: { default: 0.1 },
        maxScale: { default: 5 }
    },

    init: function() {
        this.handleGestureStart = this.handleGestureStart.bind(this);
        this.handleGestureMove = this.handleGestureMove.bind(this);
        this.handleGestureEnd = this.handleGestureEnd.bind(this);

        this.initialScale = this.el.object3D.scale.clone();
        this.scaleFactor = 1;
        this.initialRotation = 0;

        this.el.sceneEl.addEventListener('gesturestart', this.handleGestureStart);
        this.el.sceneEl.addEventListener('gesturemove', this.handleGestureMove);
        this.el.sceneEl.addEventListener('gestureend', this.handleGestureEnd);
    },

    handleGestureStart: function(event) {
        const touches = event.detail.touches;

        if (touches.length === 1) {
            // Single touch - check for tap to place
            if (!AppState.modelPlaced) {
                this.placeModel();
            }
        } else if (touches.length === 2) {
            // Two fingers - prepare for pinch or rotate
            this.initialDistance = this.getDistance(touches[0], touches[1]);
            this.initialRotation = this.getAngle(touches[0], touches[1]);
        }
    },

    handleGestureMove: function(event) {
        const touches = event.detail.touches;
        const previousTouches = event.detail.previousTouches;

        if (!AppState.modelPlaced) return;

        if (touches.length === 1 && previousTouches.length === 1) {
            // Single finger drag - move model
            this.handleDrag(touches[0], previousTouches[0]);
        } else if (touches.length === 2) {
            // Two fingers - scale and rotate
            this.handlePinchAndRotate(touches);
        }
    },

    handleGestureEnd: function(event) {
        this.initialDistance = null;
        this.initialRotation = null;
    },

    // Place model in AR space
    placeModel: function() {
        // Show model at default position
        this.el.setAttribute('visible', true);
        this.el.setAttribute('position', '0 0 -2');
        
        AppState.modelPlaced = true;
        
        // Hide placement hint
        const placementHint = document.getElementById('placement-hint');
        if (placementHint) {
            placementHint.style.display = 'none';
        }

        showToast('Model placed! Pinch to scale, drag to move, two fingers to rotate');
    },

    // Handle drag gesture
    handleDrag: function(currentTouch, previousTouch) {
        const deltaX = currentTouch.clientX - previousTouch.clientX;
        const deltaY = currentTouch.clientY - previousTouch.clientY;

        const currentPos = this.el.getAttribute('position');
        
        // Convert screen space to world space (simplified)
        const moveSpeed = 0.005;
        currentPos.x += deltaX * moveSpeed;
        currentPos.y -= deltaY * moveSpeed;

        this.el.setAttribute('position', currentPos);
    },

    // Handle pinch to scale and two-finger rotation
    handlePinchAndRotate: function(touches) {
        // Calculate current distance and angle
        const currentDistance = this.getDistance(touches[0], touches[1]);
        const currentAngle = this.getAngle(touches[0], touches[1]);

        if (this.initialDistance) {
            // Scale based on pinch
            const scaleDelta = currentDistance / this.initialDistance;
            const newScale = this.initialScale.x * scaleDelta * this.scaleFactor;
            
            // Clamp scale
            const clampedScale = Math.max(
                this.data.minScale,
                Math.min(this.data.maxScale, newScale)
            );

            this.el.setAttribute('scale', `${clampedScale} ${clampedScale} ${clampedScale}`);
        }

        if (this.initialRotation !== null) {
            // Rotate based on two-finger twist
            const rotationDelta = currentAngle - this.initialRotation;
            const currentRotation = this.el.getAttribute('rotation');
            currentRotation.y += rotationDelta;
            this.el.setAttribute('rotation', currentRotation);
            this.initialRotation = currentAngle;
        }
    },

    // Calculate distance between two touch points
    getDistance: function(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Calculate angle between two touch points
    getAngle: function(touch1, touch2) {
        return Math.atan2(
            touch2.clientY - touch1.clientY,
            touch2.clientX - touch1.clientX
        ) * (180 / Math.PI);
    },

    remove: function() {
        this.el.sceneEl.removeEventListener('gesturestart', this.handleGestureStart);
        this.el.sceneEl.removeEventListener('gesturemove', this.handleGestureMove);
        this.el.sceneEl.removeEventListener('gestureend', this.handleGestureEnd);
    }
});

// ============================================
// MODEL MANAGEMENT
// ============================================

class ModelManager {
    /**
     * Handle model switching with smooth transitions
     */
    static switchModel(modelId) {
        if (!AppState.modelPlaced) {
            showToast('Please place the current model first');
            return;
        }

        // Hide all models
        Object.values(AppState.models).forEach(model => {
            model.setAttribute('visible', false);
        });

        // Show selected model
        const selectedModel = AppState.models[modelId];
        if (selectedModel) {
            selectedModel.setAttribute('visible', true);
            AppState.currentModel = modelId;
            
            // Update UI
            document.querySelectorAll('.model-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-model="${modelId}"]`).classList.add('active');

            showToast(`Switched to ${modelId === 'model-1' ? 'Model 1' : 'Model 2'}`);
        }
    }

    /**
     * Reset model to initial position and scale
     */
    static resetModel() {
        if (!AppState.modelContainer) return;

        AppState.modelContainer.setAttribute('position', '0 0 -2');
        AppState.modelContainer.setAttribute('rotation', '0 0 0');
        AppState.modelContainer.setAttribute('scale', '1 1 1');

        showToast('Model reset to default position');
    }

    /**
     * Load USDZ model for iOS Quick Look fallback
     */
    static loadUSDZFallback(usdzPath) {
        const a = document.createElement('a');
        a.rel = 'ar';
        a.href = usdzPath;
        
        const img = document.createElement('img');
        a.appendChild(img);
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// ============================================
// SCREENSHOT CAPTURE
// ============================================

class ScreenshotManager {
    /**
     * Capture AR scene as image
     * Uses canvas toDataURL for high-quality capture
     */
    static async captureScreen() {
        try {
            const scene = document.querySelector('#ar-scene');
            const canvas = scene.canvas;

            if (!canvas) {
                showToast('Unable to capture screenshot');
                return null;
            }

            // Temporarily hide UI elements
            document.getElementById('ui-controls').style.display = 'none';

            // Wait for next frame to ensure UI is hidden
            await new Promise(resolve => requestAnimationFrame(resolve));

            // Capture canvas as data URL
            const dataURL = canvas.toDataURL('image/png', 1.0);

            // Restore UI
            document.getElementById('ui-controls').style.display = 'flex';

            return dataURL;
        } catch (error) {
            console.error('Screenshot error:', error);
            showToast('Failed to capture screenshot');
            return null;
        }
    }

    /**
     * Display screenshot preview with download/share options
     */
    static async showScreenshotPreview(dataURL) {
        const preview = document.getElementById('screenshot-preview');
        const image = document.getElementById('screenshot-image');
        const downloadLink = document.getElementById('download-screenshot');

        image.src = dataURL;
        downloadLink.href = dataURL;
        preview.style.display = 'flex';

        // Setup share functionality if available
        const shareBtn = document.getElementById('share-screenshot');
        if (navigator.share) {
            shareBtn.style.display = 'block';
            shareBtn.onclick = () => this.shareScreenshot(dataURL);
        } else {
            shareBtn.style.display = 'none';
        }
    }

    /**
     * Share screenshot using native share API
     */
    static async shareScreenshot(dataURL) {
        try {
            // Convert data URL to blob
            const response = await fetch(dataURL);
            const blob = await response.blob();
            const file = new File([blob], 'ar-screenshot.png', { type: 'image/png' });

            await navigator.share({
                title: 'My WebAR Experience',
                text: 'Check out this AR experience!',
                files: [file]
            });

            showToast('Screenshot shared successfully');
        } catch (error) {
            console.error('Share error:', error);
            showToast('Unable to share screenshot');
        }
    }
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

function updateLoadingMessage(message) {
    const messageEl = document.getElementById('loading-message');
    if (messageEl) messageEl.textContent = message;
}

function updateLoadingProgress(percent) {
    const progressEl = document.getElementById('loading-progress');
    if (progressEl) progressEl.style.width = `${percent}%`;
    AppState.loadingProgress = percent;
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

function showARScene() {
    const scene = document.getElementById('ar-scene');
    if (scene) scene.style.display = 'block';
}

function showUIControls() {
    const controls = document.getElementById('ui-controls');
    if (controls) controls.style.display = 'flex';
}

function showFallbackScreen(deviceInfo) {
    hideLoadingScreen();
    
    const fallbackScreen = document.getElementById('fallback-screen');
    const deviceDetails = document.getElementById('device-details');
    
    if (deviceDetails) {
        deviceDetails.textContent = `Device: ${deviceInfo.platform} | Browser: ${deviceInfo.userAgent.substring(0, 50)}...`;
    }
    
    if (fallbackScreen) {
        fallbackScreen.style.display = 'flex';
    }

    // Setup 3D fallback viewer button
    const fallbackBtn = document.getElementById('view-3d-fallback');
    if (fallbackBtn) {
        fallbackBtn.onclick = () => {
            window.location.href = './fallback.html';
        };
    }
}

function showPermissionScreen() {
    hideLoadingScreen();
    
    const permissionScreen = document.getElementById('permission-screen');
    if (permissionScreen) {
        permissionScreen.style.display = 'flex';
    }
}

function hidePermissionScreen() {
    const permissionScreen = document.getElementById('permission-screen');
    if (permissionScreen) {
        permissionScreen.style.display = 'none';
    }
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Info button
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.onclick = () => {
            const panel = document.getElementById('instructions-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
    }

    // Close instructions
    const closeInstructions = document.getElementById('close-instructions');
    if (closeInstructions) {
        closeInstructions.onclick = () => {
            document.getElementById('instructions-panel').style.display = 'none';
        };
    }

    // Model selector buttons
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.onclick = () => {
            const modelId = btn.getAttribute('data-model');
            ModelManager.switchModel(modelId);
        };
    });

    // Screenshot button
    const screenshotBtn = document.getElementById('screenshot-btn');
    if (screenshotBtn) {
        screenshotBtn.onclick = async () => {
            showToast('Capturing screenshot...');
            const dataURL = await ScreenshotManager.captureScreen();
            if (dataURL) {
                ScreenshotManager.showScreenshotPreview(dataURL);
            }
        };
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.onclick = () => ModelManager.resetModel();
    }

    // Close screenshot preview
    const closeScreenshot = document.getElementById('close-screenshot');
    if (closeScreenshot) {
        closeScreenshot.onclick = () => {
            document.getElementById('screenshot-preview').style.display = 'none';
        };
    }

    // Grant permission button
    const grantPermissionBtn = document.getElementById('grant-permission');
    if (grantPermissionBtn) {
        grantPermissionBtn.onclick = async () => {
            const arManager = new ARSessionManager();
            const initialized = await arManager.initializeSession();
            
            if (initialized) {
                hidePermissionScreen();
                showARScene();
                await arManager.startARSession();
            } else {
                showToast('Unable to access camera. Please check your browser settings.');
            }
        };
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

/**
 * Debounce function for performance optimization
 * Prevents excessive function calls during rapid events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for rate-limiting expensive operations
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

/**
 * Main initialization function
 * Orchestrates app startup sequence
 */
async function initializeApp() {
    console.log('🚀 Initializing WebAR Experience...');

    // Setup all event listeners
    setupEventListeners();

    // Create AR session manager
    const arManager = new ARSessionManager();

    // Initialize AR session
    const initialized = await arManager.initializeSession();

    if (initialized) {
        // Start AR session
        await arManager.startARSession();
    }

    console.log('✅ WebAR Experience initialized');
}

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ============================================
// ERROR HANDLING & LOGGING
// ============================================

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An error occurred. Please refresh the page.');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An error occurred. Please try again.');
});

// Log performance metrics
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`📊 Page load time: ${pageLoadTime}ms`);
    }
});

// ============================================
// EXPORT FOR TESTING (Optional)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        DeviceDetector,
        ARSessionManager,
        ModelManager,
        ScreenshotManager
    };
}
