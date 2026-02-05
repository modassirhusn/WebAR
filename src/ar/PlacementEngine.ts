/**
 * Advanced Multi-Object AR Placement Engine
 * Handles surface detection, collision avoidance, and spatial layout
 * Uses plain JS types (no Three.js dependency)
 */

// Vector3 type for 3D positions
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

// Euler rotation type
export interface Euler {
    x: number;
    y: number;
    z: number;
}

// Types
export interface BoundingBox {
    min: Vector3;
    max: Vector3;
    width: number;
    depth: number;
    height: number;
}

export interface PlacedObject {
    id: string;
    modelUrl: string;
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
    boundingBox: BoundingBox;
}

export interface SurfaceBounds {
    center: Vector3;
    width: number;
    depth: number;
    corners: Vector3[];
}

export interface PlacementResult {
    success: boolean;
    position?: Vector3;
    reason?: string;
}

// Configuration
const CONFIG = {
    MIN_SPACING: 0.05,        // 5cm minimum gap between objects
    SURFACE_PADDING: 0.08,    // 8cm padding from surface edges
    MAX_OBJECTS: 12,          // Maximum objects on surface
    GRID_THRESHOLD: 6,        // Switch to radial layout above this count
};

// Helper functions
function createVector3(x: number, y: number, z: number): Vector3 {
    return { x, y, z };
}

function cloneVector3(v: Vector3): Vector3 {
    return { x: v.x, y: v.y, z: v.z };
}

/**
 * Check if two bounding boxes collide with spacing buffer
 */
export function checkCollision(
    box1: BoundingBox,
    pos1: Vector3,
    box2: BoundingBox,
    pos2: Vector3,
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
    position: Vector3,
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
 */
export function calculateGridLayout(
    items: BoundingBox[],
    surfaceBounds: SurfaceBounds
): Vector3[] {
    const positions: Vector3[] = [];
    const count = items.length;

    const cols = Math.min(3, count);
    const rows = Math.ceil(count / cols);

    const maxWidth = Math.max(...items.map(b => b.width));
    const maxDepth = Math.max(...items.map(b => b.depth));
    const cellWidth = maxWidth + CONFIG.MIN_SPACING;
    const cellDepth = maxDepth + CONFIG.MIN_SPACING;

    const startX = surfaceBounds.center.x - ((cols - 1) * cellWidth) / 2;
    const startZ = surfaceBounds.center.z - ((rows - 1) * cellDepth) / 2;

    for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        positions.push(createVector3(
            startX + col * cellWidth,
            surfaceBounds.center.y,
            startZ + row * cellDepth
        ));
    }

    return positions;
}

/**
 * Radial placement algorithm for larger sets (>6 items)
 */
export function calculateRadialLayout(
    items: BoundingBox[],
    surfaceBounds: SurfaceBounds
): Vector3[] {
    const positions: Vector3[] = [];
    const count = items.length;

    positions.push(cloneVector3(surfaceBounds.center));

    if (count === 1) return positions;

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
            const angle = i * angleStep - Math.PI / 2;
            positions.push(createVector3(
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
 */
export function findValidPlacement(
    newBox: BoundingBox,
    existingObjects: PlacedObject[],
    surfaceBounds: SurfaceBounds
): PlacementResult {
    if (existingObjects.length >= CONFIG.MAX_OBJECTS) {
        return { success: false, reason: 'Surface capacity reached' };
    }

    const allBoxes = [...existingObjects.map(o => o.boundingBox), newBox];

    const positions = allBoxes.length <= CONFIG.GRID_THRESHOLD
        ? calculateGridLayout(allBoxes, surfaceBounds)
        : calculateRadialLayout(allBoxes, surfaceBounds);

    const newPosition = positions[positions.length - 1];

    if (!isWithinSurface(newPosition, newBox, surfaceBounds)) {
        return { success: false, reason: 'Position outside surface bounds' };
    }

    for (const obj of existingObjects) {
        if (checkCollision(newBox, newPosition, obj.boundingBox, obj.position)) {
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
): Vector3 | null {
    const step = box.width + CONFIG.MIN_SPACING;
    const maxAttempts = 36;

    for (let i = 0; i < maxAttempts; i++) {
        const angle = (i / maxAttempts) * 2 * Math.PI;
        const radius = step * (1 + Math.floor(i / 8));

        const testPos = createVector3(
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
): Map<string, Vector3> {
    const newPositions = new Map<string, Vector3>();
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
