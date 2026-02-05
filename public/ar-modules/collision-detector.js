/**
 * Collision Detector - AABB Collision Detection
 * Prevents object overlap and enforces minimum spacing
 */

class CollisionDetector {
    constructor() {
        this.placedObjects = [];
        this.minSpacing = 0.05; // 5cm minimum spacing between objects
        this.surfaceMargin = 0.05; // 5cm margin from surface edges
    }

    /**
     * Calculate bounding box for a 3D model
     * @param {THREE.Object3D} model - The 3D model object
     * @returns {Object} Bounding box with dimensions and center
     */
    calculateBoundingBox(model) {
        // Create box from object geometry
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();

        box.getSize(size);
        box.getCenter(center);

        return {
            width: size.x,
            depth: size.z,
            height: size.y,
            center: center,
            min: box.min.clone(),
            max: box.max.clone(),
            model: model
        };
    }

    /**
     * AABB (Axis-Aligned Bounding Box) collision detection
     * @param {Object} newBox - Bounding box to test
     * @param {Array} existingBoxes - Array of existing bounding boxes
     * @returns {boolean} True if collision detected
     */
    checkCollision(newBox, existingBoxes = this.placedObjects) {
        for (const existing of existingBoxes) {
            // Calculate distance between centers
            const dx = Math.abs(newBox.center.x - existing.center.x);
            const dz = Math.abs(newBox.center.z - existing.center.z);

            // Calculate minimum required distance (half-widths + spacing)
            const minDistX = (newBox.width + existing.width) / 2 + this.minSpacing;
            const minDistZ = (newBox.depth + existing.depth) / 2 + this.minSpacing;

            // Check if boxes overlap on both axes
            if (dx < minDistX && dz < minDistZ) {
                return true; // Collision detected
            }
        }

        return false; // No collision
    }

    /**
     * Check if position is within surface bounds with margin
     * @param {THREE.Vector3} position - Position to check
     * @param {Object} bounds - Surface bounds
     * @param {Object} objectSize - Object dimensions {width, depth}
     * @returns {boolean} True if within bounds
     */
    isWithinSurface(position, bounds, objectSize = { width: 0, depth: 0 }) {
        const halfWidth = objectSize.width / 2;
        const halfDepth = objectSize.depth / 2;

        return (
            position.x - halfWidth >= bounds.minX + this.surfaceMargin &&
            position.x + halfWidth <= bounds.maxX - this.surfaceMargin &&
            position.z - halfDepth >= bounds.minZ + this.surfaceMargin &&
            position.z + halfDepth <= bounds.maxZ - this.surfaceMargin
        );
    }

    /**
     * Find nearest valid position if current position is invalid
     * @param {THREE.Vector3} desiredPosition - Desired position
     * @param {Object} objectSize - Object dimensions
     * @param {Object} bounds - Surface bounds
     * @returns {THREE.Vector3|null} Valid position or null
     */
    findNearestValidPosition(desiredPosition, objectSize, bounds) {
        const testRadius = 0.1; // 10cm search radius
        const testSteps = 8; // Number of directions to test

        // Try positions in a circle around desired position
        for (let radius = 0; radius <= testRadius; radius += 0.02) {
            for (let i = 0; i < testSteps; i++) {
                const angle = (i / testSteps) * Math.PI * 2;
                const testPos = new THREE.Vector3(
                    desiredPosition.x + Math.cos(angle) * radius,
                    desiredPosition.y,
                    desiredPosition.z + Math.sin(angle) * radius
                );

                const testBox = {
                    center: testPos,
                    width: objectSize.width,
                    depth: objectSize.depth,
                    height: objectSize.height
                };

                if (
                    this.isWithinSurface(testPos, bounds, objectSize) &&
                    !this.checkCollision(testBox)
                ) {
                    return testPos;
                }
            }
        }

        return null; // No valid position found
    }

    /**
     * Add object to collision tracking
     * @param {Object} boundingBox - Bounding box to track
     */
    addObject(boundingBox) {
        this.placedObjects.push(boundingBox);
    }

    /**
     * Remove object from collision tracking
     * @param {THREE.Object3D} model - Model to remove
     */
    removeObject(model) {
        this.placedObjects = this.placedObjects.filter(
            box => box.model !== model
        );
    }

    /**
     * Clear all tracked objects
     */
    clear() {
        this.placedObjects = [];
    }

    /**
     * Get all occupied positions
     * @returns {Array} Array of occupied positions
     */
    getOccupiedPositions() {
        return this.placedObjects.map(box => ({
            position: box.center.clone(),
            size: { width: box.width, depth: box.depth, height: box.height }
        }));
    }

    /**
     * Visualize bounding boxes (debugging)
     * @param {THREE.Scene} scene - Scene to add debug visuals
     */
    visualizeCollisionBoxes(scene) {
        this.placedObjects.forEach(box => {
            const geometry = new THREE.BoxGeometry(box.width, box.height, box.depth);
            const material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true,
                opacity: 0.5,
                transparent: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(box.center);
            scene.add(mesh);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollisionDetector;
}
