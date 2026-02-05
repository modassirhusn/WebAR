/**
 * A-Frame AR Placement Component
 * Integrates all AR modules for multi-object placement
 */

// Ensure A-Frame is loaded
if (typeof AFRAME === 'undefined') {
    console.error('A-Frame not loaded! Include A-Frame library first.');
}

AFRAME.registerComponent('ar-multi-placement', {
    schema: {
        enabled: { type: 'boolean', default: true },
        showSurface: { type: 'boolean', default: true },
        showFeedback: { type: 'boolean', default: true },
        minSpacing: { type: 'number', default: 0.05 }
    },

    init() {
        console.log('🎯 AR Multi-Placement System Initialized');

        // Initialize modules
        this.surfaceDetector = new SurfaceDetector(this.el.sceneEl.object3D);
        this.collisionDetector = new CollisionDetector();
        this.layoutManager = new LayoutManager(
            this.surfaceDetector,
            this.collisionDetector
        );
        this.placementFeedback = new PlacementFeedback(this.el.sceneEl.object3D);

        // Set minimum spacing
        this.collisionDetector.minSpacing = this.data.minSpacing;

        // Track placed items
        this.placedItems = [];
        this.pendingItems = [];

        // Bind methods
        this.placeItem = this.placeItem.bind(this);
        this.placeMultipleItems = this.placeMultipleItems.bind(this);
        this.clearAll = this.clearAll.bind(this);

        // Expose API to window for external access
        window.ARPlacement = {
            placeItem: this.placeItem,
            placeMultiple: this.placeMultipleItems,
            clear: this.clearAll,
            getPlacedItems: () => this.placedItems
        };

        // Setup XR session handlers
        this.setupXRHandlers();
    },

    setupXRHandlers() {
        const sceneEl = this.el.sceneEl;

        sceneEl.addEventListener('enter-vr', () => {
            console.log('✅ Entered AR mode');
            if (this.data.showSurface) {
                this.showSurfaceVisualization();
            }
        });

        sceneEl.addEventListener('exit-vr', () => {
            console.log('❌ Exited AR mode');
            this.placementFeedback.cleanup();
        });
    },

    tick(time, deltaTime) {
        if (!this.data.enabled) return;

        // Get XR frame
        const sceneEl = this.el.sceneEl;
        if (!sceneEl.is('ar-mode')) return;

        const frame = sceneEl.frame;
        const referenceSpace = sceneEl.renderer.xr.getReferenceSpace();

        if (frame && referenceSpace) {
            // Update surface detection
            this.surfaceDetector.detectPlanes(frame, referenceSpace);

            // Update surface visualization
            if (this.data.showSurface && this.surfaceDetector.activeSurface) {
                this.updateSurfaceVisualization();
            }
        }
    },

    /**
     * Place a single item on the detected surface
     * @param {Object} itemConfig - {modelUrl, scale, size}
     */
    placeItem(itemConfig) {
        const surface = this.surfaceDetector.activeSurface;

        if (!surface) {
            console.warn('⚠️ No surface detected yet');
            return false;
        }

        // Add to pending items
        this.pendingItems.push(itemConfig);

        // Calculate layout for all items
        const allItems = [...this.placedItems, ...this.pendingItems].map(item => ({
            size: item.size || { width: 0.1, depth: 0.1, height: 0.1 }
        }));

        const positions = this.layoutManager.reflowLayout(allItems, surface.bounds);

        if (positions.length < allItems.length) {
            console.warn('⚠️ Not enough space for all items');
            return false;
        }

        // Get position for new item
        const position = positions[positions.length - 1];

        // Create A-Frame entity
        const entity = this.createEntity(itemConfig, position);

        // Add to scene
        this.el.sceneEl.appendChild(entity);

        // Track placed item
        this.placedItems.push({
            entity,
            config: itemConfig,
            position
        });

        // Remove from pending
        this.pendingItems = [];

        // Update collision detector
        setTimeout(() => {
            const bbox = this.collisionDetector.calculateBoundingBox(entity.object3D);
            this.collisionDetector.addObject(bbox);
        }, 100);

        // Show success feedback
        if (this.data.showFeedback) {
            this.placementFeedback.showSuccessIndicator(position);
        }

        console.log(`✅ Placed item at (${position.x.toFixed(2)}, ${position.z.toFixed(2)})`);
        return true;
    },

    /**
     * Place multiple items at once
     * @param {Array} items - Array of item configs
     */
    placeMultipleItems(items) {
        const surface = this.surfaceDetector.activeSurface;

        if (!surface) {
            console.warn('⚠️ No surface detected yet');
            return false;
        }

        // Calculate layout for all items
        const itemsWithSize = items.map(item => ({
            ...item,
            size: item.size || { width: 0.1, depth: 0.1, height: 0.1 }
        }));

        const positions = this.layoutManager.reflowLayout(
            itemsWithSize,
            surface.bounds
        );

        if (positions.length < items.length) {
            console.warn(`⚠️ Can only fit ${positions.length} of ${items.length} items`);
        }

        // Place each item
        const placedCount = Math.min(positions.length, items.length);

        for (let i = 0; i < placedCount; i++) {
            const entity = this.createEntity(items[i], positions[i]);
            this.el.sceneEl.appendChild(entity);

            this.placedItems.push({
                entity,
                config: items[i],
                position: positions[i]
            });

            // Update collision detector
            setTimeout(() => {
                const bbox = this.collisionDetector.calculateBoundingBox(entity.object3D);
                this.collisionDetector.addObject(bbox);
            }, 100);

            // Show success feedback with delay
            if (this.data.showFeedback) {
                setTimeout(() => {
                    this.placementFeedback.showSuccessIndicator(positions[i]);
                }, i * 100);
            }
        }

        console.log(`✅ Placed ${placedCount} items`);
        return placedCount;
    },

    /**
     * Create A-Frame entity for item
     */
    createEntity(config, position) {
        const entity = document.createElement('a-entity');

        // Set model
        entity.setAttribute('gltf-model', config.modelUrl);

        // Set scale
        const scale = config.scale || { x: 1, y: 1, z: 1 };
        entity.setAttribute('scale', scale);

        // Set position
        entity.setAttribute('position', position);

        // Add spawn animation
        entity.setAttribute('animation', {
            property: 'scale',
            from: '0 0 0',
            to: `${scale.x} ${scale.y} ${scale.z}`,
            dur: 500,
            easing: 'easeOutElastic'
        });

        // Add shadow
        entity.setAttribute('shadow', 'cast: true; receive: false');

        return entity;
    },

    /**
     * Show/update surface visualization
     */
    updateSurfaceVisualization() {
        const mesh = this.surfaceDetector.visualizeSurface();
        if (mesh && !this.surfaceMesh) {
            this.el.sceneEl.object3D.add(mesh);
            this.surfaceMesh = mesh;
        }
    },

    showSurfaceVisualization() {
        if (this.surfaceDetector.activeSurface) {
            this.placementFeedback.showSurfaceBoundary(
                this.surfaceDetector.activeSurface.bounds
            );
        }
    },

    /**
     * Clear all placed items
     */
    clearAll() {
        this.placedItems.forEach(item => {
            if (item.entity && item.entity.parentNode) {
                item.entity.parentNode.removeChild(item.entity);
            }
        });

        this.placedItems = [];
        this.pendingItems = [];
        this.collisionDetector.clear();

        console.log('🗑️ Cleared all items');
    },

    remove() {
        this.placementFeedback.cleanup();
        this.clearAll();
    }
});

console.log('✅ AR Multi-Placement Component Registered');
