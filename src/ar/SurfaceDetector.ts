/**
 * WebXR Surface Detection Module
 * Detects horizontal planes and tracks surface boundaries
 */

export interface DetectedSurface {
    id: string;
    plane: XRPlane;
    polygon: DOMPointReadOnly[];
    center: { x: number; y: number; z: number };
    width: number;
    depth: number;
    lastUpdated: number;
}

// Surface detection state
let surfaces: Map<string, DetectedSurface> = new Map();
let isDetecting = false;
let xrSession: XRSession | null = null;
let xrRefSpace: XRReferenceSpace | null = null;

/**
 * Check WebXR AR support
 */
export async function checkARSupport(): Promise<boolean> {
    if (!navigator.xr) return false;

    try {
        return await navigator.xr.isSessionSupported('immersive-ar');
    } catch {
        return false;
    }
}

/**
 * Start WebXR AR session with plane detection
 */
export async function startARSession(
    _canvas: HTMLCanvasElement,
    onSurfaceDetected: (surface: DetectedSurface) => void,
    onSurfaceUpdated: (surface: DetectedSurface) => void,
    onSurfaceLost: (surfaceId: string) => void
): Promise<XRSession | null> {
    if (!navigator.xr) {
        console.error('WebXR not supported');
        return null;
    }

    try {
        xrSession = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test', 'plane-detection'],
            optionalFeatures: ['dom-overlay', 'light-estimation'],
            domOverlay: { root: document.getElementById('ar-overlay') || document.body },
        });

        xrRefSpace = await xrSession.requestReferenceSpace('local-floor');
        isDetecting = true;

        // Set up frame loop with plane detection
        xrSession.requestAnimationFrame((_time, frame) => {
            processFrame(frame, onSurfaceDetected, onSurfaceUpdated, onSurfaceLost);
        });

        xrSession.addEventListener('end', () => {
            isDetecting = false;
            surfaces.clear();
            xrSession = null;
            xrRefSpace = null;
        });

        return xrSession;
    } catch (error) {
        console.error('Failed to start AR session:', error);
        return null;
    }
}

/**
 * Process each XR frame for plane detection
 */
function processFrame(
    frame: XRFrame,
    onSurfaceDetected: (surface: DetectedSurface) => void,
    onSurfaceUpdated: (surface: DetectedSurface) => void,
    onSurfaceLost: (surfaceId: string) => void
) {
    if (!isDetecting || !xrSession || !xrRefSpace) return;

    // Get detected planes
    const detectedPlanes = frame.detectedPlanes;
    if (!detectedPlanes) {
        xrSession.requestAnimationFrame((_time, nextFrame) => {
            processFrame(nextFrame, onSurfaceDetected, onSurfaceUpdated, onSurfaceLost);
        });
        return;
    }

    const currentPlaneIds = new Set<string>();

    // Process each detected plane
    detectedPlanes.forEach((plane) => {
        // Only track horizontal planes (tables, floors)
        if (plane.orientation !== 'horizontal') return;

        const planePose = frame.getPose(plane.planeSpace, xrRefSpace!);
        if (!planePose) return;

        const planeId = generatePlaneId(plane);
        currentPlaneIds.add(planeId);

        const polygon = plane.polygon;
        const bounds = calculatePlaneBounds(polygon, planePose);

        const surface: DetectedSurface = {
            id: planeId,
            plane,
            polygon,
            center: {
                x: planePose.transform.position.x,
                y: planePose.transform.position.y,
                z: planePose.transform.position.z,
            },
            width: bounds.width,
            depth: bounds.depth,
            lastUpdated: Date.now(),
        };

        if (surfaces.has(planeId)) {
            // Update existing surface
            surfaces.set(planeId, surface);
            onSurfaceUpdated(surface);
        } else {
            // New surface detected
            surfaces.set(planeId, surface);
            onSurfaceDetected(surface);
        }
    });

    // Check for lost surfaces
    surfaces.forEach((_, id) => {
        if (!currentPlaneIds.has(id)) {
            surfaces.delete(id);
            onSurfaceLost(id);
        }
    });

    // Continue frame loop
    xrSession.requestAnimationFrame((_time, nextFrame) => {
        processFrame(nextFrame, onSurfaceDetected, onSurfaceUpdated, onSurfaceLost);
    });
}

/**
 * Calculate plane bounds from polygon
 */
function calculatePlaneBounds(
    polygon: DOMPointReadOnly[],
    _pose: XRPose
): { width: number; depth: number } {
    if (polygon.length < 3) {
        return { width: 0.5, depth: 0.5 };
    }

    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    polygon.forEach((point) => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minZ = Math.min(minZ, point.z);
        maxZ = Math.max(maxZ, point.z);
    });

    return {
        width: maxX - minX,
        depth: maxZ - minZ,
    };
}

/**
 * Generate unique ID for plane
 */
function generatePlaneId(plane: XRPlane): string {
    const polygon = plane.polygon;
    if (polygon.length === 0) return `plane-${Date.now()}`;

    // Create ID from polygon signature
    const signature = polygon.slice(0, 3).map(p =>
        `${p.x.toFixed(2)},${p.z.toFixed(2)}`
    ).join('|');

    return `plane-${signature}`;
}

/**
 * Get all currently detected surfaces
 */
export function getDetectedSurfaces(): DetectedSurface[] {
    return Array.from(surfaces.values());
}

/**
 * Get the largest detected surface (likely the table)
 */
export function getLargestSurface(): DetectedSurface | null {
    let largest: DetectedSurface | null = null;
    let maxArea = 0;

    surfaces.forEach((surface) => {
        const area = surface.width * surface.depth;
        if (area > maxArea) {
            maxArea = area;
            largest = surface;
        }
    });

    return largest;
}

/**
 * Stop surface detection
 */
export function stopDetection() {
    isDetecting = false;
    if (xrSession) {
        xrSession.end();
    }
}

/**
 * Clean up resources
 */
export function cleanup() {
    stopDetection();
    surfaces.clear();
}
