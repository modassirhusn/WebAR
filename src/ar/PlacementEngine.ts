/**
 * Advanced Multi-Object AR Placement Engine
 * Handles surface detection, collision avoidance, and spatial layout
 */

import * as THREE from 'three';

// Types
export interface BoundingBox {
    min: THREE.Vector3;
    max: THREE.Vector3;
    width: number;
    depth: number;
    height: number;
}

export interface PlacedObject {
    id: string;
    modelUrl: string;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    boundingBox: BoundingBox;
}

export interface SurfaceBounds {
    center: THREE.Vector3;
    width: number;
    depth: number;
    corners: THREE.Vector3[];
}

export interface PlacementResult {
    success: boolean;
    position?: THREE.Vector3;
    reason?: string;
}

// Configuration
const CONFIG = {
    MIN_SPACING: 0.05,        // 5cm minimum gap between objects
    SURFACE_PADDING: 0.08,    // 8cm padding from surface edges
    MAX_OBJECTS: 12,          // Maximum objects on surface
    GRID_THRESHOLD: 6,        // Switch to radial layout above this count
};

/**
 * Calculate bounding box for a 3D model
 */
export function calculateBoundingBox(
    mesh: THREE.Object3D,
    scale: THREE.Vector3
): BoundingBox {
    const box = new THREE.Box3().setFromObject(mesh);

    return {
        min: box.min.clone().multiply(scale),
        max: box.max.clone().multiply(scale),
        width: (box.max.x - box.min.x) * scale.x,
        depth: (box.max.z - box.min.z) * scale.z,
        height: (box.max.y - box.min.y) * scale.y,
    };
}

/**
 * Check if two bounding boxes collide with spacing buffer
 */
export function checkCollision(
    box1: BoundingBox,
    pos1: THREE.Vector3,
    box2: BoundingBox,
    pos2: THREE.Vector3,
    spacing: number = CONFIG.MIN_SPACING
): boolean {
    const halfWidth1 = box1.width / 2 + spacing;
    const halfDepth1 = box1.depth / 2 + spacing;
    const halfWidth2 = box2.width / 2;
    const halfDepth2 = box2.depth / 2;

    const dx = Math.abs(pos1.x - pos2.x);
    const dz = Math.abs(pos1.z - pos2.z);

    return dx < (halfWidth1 + halfWidth2) && dz < (halfDepth1 + halfDepth2);
}

/**
 * Check if position is within surface bounds
 */
export function isWithinSurface(
    position: THREE.Vector3,
    boundingBox: BoundingBox,
    surfaceBounds: SurfaceBounds
): boolean {
    const halfWidth = boundingBox.width / 2 + CONFIG.SURFACE_PADDING;
    const halfDepth = boundingBox.depth / 2 + CONFIG.SURFACE_PADDING;
    const surfaceHalfWidth = surfaceBounds.width / 2;
    const surfaceHalfDepth = surfaceBounds.depth / 2;

    const relX = position.x - surfaceBounds.center.x;
    const relZ = position.z - surfaceBounds.center.z;

    return (
        Math.abs(relX) + halfWidth <= surfaceHalfWidth &&
        Math.abs(relZ) + halfDepth <= surfaceHalfDepth
    );
}

/**
 * Grid placement algorithm for small sets (≤6 items)
 * Arranges items in rows like dishes on a table
 */
export function calculateGridLayout(
    items: BoundingBox[],
    surfaceBounds: SurfaceBounds
): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    const count = items.length;

    // Calculate optimal grid dimensions
    const cols = Math.min(3, count);
    const rows = Math.ceil(count / cols);

    // Calculate total dimensions needed
    const maxWidth = Math.max(...items.map(b => b.width));
    const maxDepth = Math.max(...items.map(b => b.depth));
    const cellWidth = maxWidth + CONFIG.MIN_SPACING;
    const cellDepth = maxDepth + CONFIG.MIN_SPACING;

    // Center the grid on surface
    const startX = surfaceBounds.center.x - ((cols - 1) * cellWidth) / 2;
    const startZ = surfaceBounds.center.z - ((rows - 1) * cellDepth) / 2;

    for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        positions.push(new THREE.Vector3(
            startX + col * cellWidth,
            surfaceBounds.center.y,
            startZ + row * cellDepth
        ));
    }

    return positions;
}

/**
 * Radial placement algorithm for larger sets (>6 items)
 * Arranges items in concentric circles from center
 */
export function calculateRadialLayout(
    items: BoundingBox[],
    surfaceBounds: SurfaceBounds
): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    const count = items.length;

    // Place first item at center
    positions.push(surfaceBounds.center.clone());

    if (count === 1) return positions;

    // Calculate rings
    let placedCount = 1;
    let ring = 1;
    const baseRadius = Math.max(...items.map(b => Math.max(b.width, b.depth))) + CONFIG.MIN_SPACING;

    while (placedCount < count) {
        const radius = baseRadius * ring;
        const circumference = 2 * Math.PI * radius;
        const maxItemsInRing = Math.floor(circumference / (baseRadius));
        const itemsInRing = Math.min(maxItemsInRing, count - placedCount);
        const angleStep = (2 * Math.PI) / itemsInRing;

        for (let i = 0; i < itemsInRing && placedCount < count; i++) {
            const angle = i * angleStep - Math.PI / 2; // Start from top
            positions.push(new THREE.Vector3(
                surfaceBounds.center.x + Math.cos(angle) * radius,
                surfaceBounds.center.y,
                surfaceBounds.center.z + Math.sin(angle) * radius
            ));
            placedCount++;
        }
        ring++;
    }

    return positions;
}

/**
 * Find valid placement position for a new object
 * Avoids collisions with existing objects
 */
export function findValidPlacement(
    newBox: BoundingBox,
    existingObjects: PlacedObject[],
    surfaceBounds: SurfaceBounds
): PlacementResult {
    if (existingObjects.length >= CONFIG.MAX_OBJECTS) {
        return { success: false, reason: 'Surface capacity reached' };
    }

    // Get all bounding boxes for layout calculation
    const allBoxes = [...existingObjects.map(o => o.boundingBox), newBox];

    // Choose layout strategy based on count
    const positions = allBoxes.length <= CONFIG.GRID_THRESHOLD
        ? calculateGridLayout(allBoxes, surfaceBounds)
        : calculateRadialLayout(allBoxes, surfaceBounds);

    const newPosition = positions[positions.length - 1];

    // Validate position is within surface
    if (!isWithinSurface(newPosition, newBox, surfaceBounds)) {
        return { success: false, reason: 'Position outside surface bounds' };
    }

    // Check for collisions with existing objects
    for (const obj of existingObjects) {
        if (checkCollision(newBox, newPosition, obj.boundingBox, obj.position)) {
            // Try to find alternative position
            const altPosition = findAlternativePosition(newBox, existingObjects, surfaceBounds);
            if (altPosition) {
                return { success: true, position: altPosition };
            }
            return { success: false, reason: 'No valid position found' };
        }
    }

    return { success: true, position: newPosition };
}

/**
 * Find alternative position using spiral search
 */
function findAlternativePosition(
    box: BoundingBox,
    existingObjects: PlacedObject[],
    surfaceBounds: SurfaceBounds
): THREE.Vector3 | null {
    const step = box.width + CONFIG.MIN_SPACING;
    const maxAttempts = 36;

    for (let i = 0; i < maxAttempts; i++) {
        const angle = (i / maxAttempts) * 2 * Math.PI;
        const radius = step * (1 + Math.floor(i / 8));

        const testPos = new THREE.Vector3(
            surfaceBounds.center.x + Math.cos(angle) * radius,
            surfaceBounds.center.y,
            surfaceBounds.center.z + Math.sin(angle) * radius
        );

        if (!isWithinSurface(testPos, box, surfaceBounds)) continue;

        let hasCollision = false;
        for (const obj of existingObjects) {
            if (checkCollision(box, testPos, obj.boundingBox, obj.position)) {
                hasCollision = true;
                break;
            }
        }

        if (!hasCollision) return testPos;
    }

    return null;
}

/**
 * Reflow all objects when layout changes
 */
export function reflowLayout(
    objects: PlacedObject[],
    surfaceBounds: SurfaceBounds
): Map<string, THREE.Vector3> {
    const newPositions = new Map<string, THREE.Vector3>();
    const boxes = objects.map(o => o.boundingBox);

    const positions = objects.length <= CONFIG.GRID_THRESHOLD
        ? calculateGridLayout(boxes, surfaceBounds)
        : calculateRadialLayout(boxes, surfaceBounds);

    objects.forEach((obj, i) => {
        if (positions[i]) {
            newPositions.set(obj.id, positions[i]);
        }
    });

    return newPositions;
}

/**
 * Create ghost preview mesh for placement feedback
 */
export function createGhostPreview(
    originalMesh: THREE.Object3D,
    isValid: boolean
): THREE.Object3D {
    const ghost = originalMesh.clone();

    ghost.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
                color: isValid ? 0x00ff00 : 0xff0000,
                transparent: true,
                opacity: 0.4,
                wireframe: false,
            });
        }
    });

    return ghost;
}

/**
 * Animate object spawn with scale-up effect
 */
export function animateSpawn(
    object: THREE.Object3D,
    targetScale: THREE.Vector3,
    duration: number = 300
): Promise<void> {
    return new Promise((resolve) => {
        object.scale.set(0, 0, 0);
        const startTime = performance.now();

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            object.scale.set(
                targetScale.x * eased,
                targetScale.y * eased,
                targetScale.z * eased
            );

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animate);
    });
}
