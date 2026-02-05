/**
 * Placement Feedback - Visual indicators for AR placement
 * Ghost previews, invalid zones, and spawn animations
 */

class PlacementFeedback {
    constructor(scene) {
        this.scene = scene;
        this.ghostPreview = null;
        this.invalidZones = [];
        this.surfaceIndicator = null;
    }

    /**
     * Create ghost preview of object to be placed
     * @param {string} modelUrl - URL of 3D model
     * @param {THREE.Vector3} position - Preview position
     * @param {boolean} isValid - Whether position is valid
     */
    showGhostPreview(modelUrl, position, isValid = true) {
        // Remove old preview
        this.hideGhostPreview();

        // Create ghost material
        const ghostMaterial = new THREE.MeshStandardMaterial({
            color: isValid ? 0x00ff00 : 0xff0000,
            opacity: 0.5,
            transparent: true,
            emissive: isValid ? 0x00ff00 : 0xff0000,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide
        });

        // Load model and apply ghost material
        const loader = new THREE.GLTFLoader();
        loader.load(modelUrl, (gltf) => {
            this.ghostPreview = gltf.scene;

            // Apply ghost material to all meshes
            this.ghostPreview.traverse((child) => {
                if (child.isMesh) {
                    child.material = ghostMaterial;
                }
            });

            this.ghostPreview.position.copy(position);
            this.scene.add(this.ghostPreview);

            // Pulse animation
            this.animateGhostPulse();
        });
    }

    /**
     * Animate ghost preview with pulsing effect
     */
    animateGhostPulse() {
        if (!this.ghostPreview) return;

        const startScale = 0.9;
        const endScale = 1.1;
        const duration = 1000; // 1 second
        const startTime = Date.now();

        const animate = () => {
            if (!this.ghostPreview) return;

            const elapsed = Date.now() - startTime;
            const progress = (elapsed % duration) / duration;
            const scale = startScale + (endScale - startScale) *
                Math.sin(progress * Math.PI);

            this.ghostPreview.scale.setScalar(scale);

            requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * Hide ghost preview
     */
    hideGhostPreview() {
        if (this.ghostPreview) {
            this.scene.remove(this.ghostPreview);
            this.ghostPreview = null;
        }
    }

    /**
     * Highlight invalid placement zones
     * @param {Array} positions - Array of invalid positions
     */
    highlightInvalidZones(positions) {
        // Clear old zones
        this.clearInvalidZones();

        positions.forEach(pos => {
            const geometry = new THREE.CircleGeometry(0.1, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                opacity: 0.3,
                transparent: true,
                side: THREE.DoubleSide
            });

            const circle = new THREE.Mesh(geometry, material);
            circle.position.copy(pos);
            circle.rotation.x = -Math.PI / 2;

            this.scene.add(circle);
            this.invalidZones.push(circle);
        });
    }

    /**
     * Clear invalid zone indicators
     */
    clearInvalidZones() {
        this.invalidZones.forEach(zone => {
            this.scene.remove(zone);
        });
        this.invalidZones = [];
    }

    /**
     * Show surface boundary indicator
     * @param {Object} bounds - Surface bounds
     */
    showSurfaceBoundary(bounds) {
        if (this.surfaceIndicator) {
            this.scene.remove(this.surfaceIndicator);
        }

        // Create wireframe box for surface
        const width = bounds.width;
        const depth = bounds.depth;
        const height = 0.01;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            linewidth: 2,
            opacity: 0.6,
            transparent: true
        });

        this.surfaceIndicator = new THREE.LineSegments(edges, material);
        this.surfaceIndicator.position.set(
            (bounds.minX + bounds.maxX) / 2,
            bounds.centerY,
            (bounds.minZ + bounds.maxZ) / 2
        );

        this.scene.add(this.surfaceIndicator);
    }

    /**
     * Hide surface boundary
     */
    hideSurfaceBoundary() {
        if (this.surfaceIndicator) {
            this.scene.remove(this.surfaceIndicator);
            this.surfaceIndicator = null;
        }
    }

    /**
     * Spawn animation for placed object
     * @param {THREE.Object3D} object - Object to animate
     * @param {Function} onComplete - Callback when animation completes
     */
    playSpawnAnimation(object, onComplete) {
        const duration = 500; // 500ms
        const startScale = 0;
        const endScale = 1;
        const startTime = Date.now();

        // Store original scale
        const originalScale = object.scale.clone();

        // Start from zero scale
        object.scale.setScalar(0);

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out elastic
            const eased = this.easeOutElastic(progress);
            const scale = startScale + (endScale - startScale) * eased;

            object.scale.copy(originalScale).multiplyScalar(scale);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                onComplete();
            }
        };

        animate();
    }

    /**
     * Ease out elastic easing function
     */
    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0
            ? 0
            : t === 1
                ? 1
                : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    /**
     * Show placement success indicator
     * @param {THREE.Vector3} position - Position where object was placed
     */
    showSuccessIndicator(position) {
        const geometry = new THREE.RingGeometry(0.05, 0.08, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            opacity: 1,
            transparent: true,
            side: THREE.DoubleSide
        });

        const ring = new THREE.Mesh(geometry, material);
        ring.position.copy(position);
        ring.rotation.x = -Math.PI / 2;

        this.scene.add(ring);

        // Fade out and expand
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                ring.scale.setScalar(1 + progress * 2);
                ring.material.opacity = 1 - progress;
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(ring);
            }
        };

        animate();
    }

    /**
     * Clean up all feedback visuals
     */
    cleanup() {
        this.hideGhostPreview();
        this.clearInvalidZones();
        this.hideSurfaceBoundary();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlacementFeedback;
}
