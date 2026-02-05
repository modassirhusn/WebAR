/**
 * Layout Manager - Spatial Arrangement Algorithms
 * Calculates optimal positions for multiple objects on a surface
 */

class LayoutManager {
    constructor(surfaceDetector, collisionDetector) {
        this.surface = surfaceDetector;
        this.collision = collisionDetector;
        this.gridThreshold = 6; // Use grid for ≤6 items, radial for >6
    }

    /**
     * Calculate layout for all items
     * @param {Array} items - Array of items to place
     * @param {Object} surfaceBounds - Surface boundaries
     * @returns {Array} Array of positions
     */
    calculateLayout(items, surfaceBounds) {
        if (!surfaceBounds) return [];

        const layout = items.length <= this.gridThreshold
            ? this.calculateGridLayout(items, surfaceBounds)
            : this.calculateRadialLayout(items, surfaceBounds);

        return layout;
    }

    /**
     * Grid layout for small sets (1-6 items)
     * Arranges items in a rectangular grid
     */
    calculateGridLayout(items, bounds) {
        const count = items.length;
        if (count === 0) return [];

        // Calculate optimal grid dimensions
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);

        const surfaceWidth = bounds.width;
        const surfaceDepth = bounds.depth;

        // Calculate cell size
        const cellWidth = surfaceWidth / cols;
        const cellDepth = surfaceDepth / rows;

        const positions = [];

        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;

            // Calculate position (centered in cell)
            const x = bounds.minX + (col + 0.5) * cellWidth;
            const z = bounds.minZ + (row + 0.5) * cellDepth;
            const y = bounds.centerY;

            positions.push(new THREE.Vector3(x, y, z));
        }

        return positions;
    }

    /**
     * Radial layout for large sets (7+ items)
     * Arranges items in a circle around center
     */
    calculateRadialLayout(items, bounds) {
        const count = items.length;
        if (count === 0) return [];

        // Calculate center point
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerZ = (bounds.minZ + bounds.maxZ) / 2;
        const centerY = bounds.centerY;

        // Calculate radius (use 60% of available space)
        const maxRadius = Math.min(bounds.width, bounds.depth) * 0.3;

        // Determine if we need multiple rings
        const itemsPerRing = 8;
        const rings = Math.ceil(count / itemsPerRing);

        const positions = [];
        let itemIndex = 0;

        for (let ring = 0; ring < rings && itemIndex < count; ring++) {
            const ringRadius = maxRadius * (ring + 1) / rings;
            const itemsInThisRing = Math.min(
                itemsPerRing,
                count - itemIndex
            );
            const angleStep = (2 * Math.PI) / itemsInThisRing;

            for (let i = 0; i < itemsInThisRing; i++) {
                const angle = i * angleStep + (ring * Math.PI / 4); // Offset each ring
                const x = centerX + ringRadius * Math.cos(angle);
                const z = centerZ + ringRadius * Math.sin(angle);

                positions.push(new THREE.Vector3(x, centerY, z));
                itemIndex++;
            }
        }

        return positions;
    }

    /**
     * Dynamic reflow - recalculate layout when items change
     * Validates positions and adjusts if needed
     */
    reflowLayout(items, surfaceBounds) {
        if (!surfaceBounds) return [];

        // Calculate initial layout
        let positions = this.calculateLayout(items, surfaceBounds);

        // Validate and adjust positions
        const validatedPositions = [];

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const item = items[i];

            // Estimate object size (can be customized per item)
            const objectSize = {
                width: item.size?.width || 0.1,
                depth: item.size?.depth || 0.1,
                height: item.size?.height || 0.1
            };

            // Check if position is valid
            const isValid = this.collision.isWithinSurface(
                pos,
                surfaceBounds,
                objectSize
            );

            if (isValid) {
                // Create temporary bounding box for collision check
                const tempBox = {
                    center: pos,
                    width: objectSize.width,
                    depth: objectSize.depth,
                    height: objectSize.height
                };

                // Check collision with already validated positions
                const hasCollision = validatedPositions.some(validPos => {
                    const validBox = {
                        center: validPos,
                        width: objectSize.width,
                        depth: objectSize.depth,
                        height: objectSize.height
                    };
                    return this.collision.checkCollision(tempBox, [validBox]);
                });

                if (!hasCollision) {
                    validatedPositions.push(pos);
                } else {
                    // Try to find alternative position
                    const altPos = this.collision.findNearestValidPosition(
                        pos,
                        objectSize,
                        surfaceBounds
                    );
                    if (altPos) {
                        validatedPositions.push(altPos);
                    }
                }
            }
        }

        return validatedPositions;
    }

    /**
     * Calculate spacing between items
     */
    calculateOptimalSpacing(itemCount, surfaceArea) {
        const areaPerItem = surfaceArea / itemCount;
        const spacing = Math.sqrt(areaPerItem) * 0.3; // 30% of item area
        return Math.max(0.05, Math.min(spacing, 0.2)); // Clamp between 5-20cm
    }

    /**
     * Check if surface can accommodate all items
     */
    canFitAllItems(itemCount, surfaceBounds) {
        const minAreaPerItem = 0.04; // 20cm x 20cm minimum
        const surfaceArea = surfaceBounds.width * surfaceBounds.depth;
        return surfaceArea >= (itemCount * minAreaPerItem);
    }

    /**
     * Get layout type for item count
     */
    getLayoutType(itemCount) {
        return itemCount <= this.gridThreshold ? 'grid' : 'radial';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutManager;
}
