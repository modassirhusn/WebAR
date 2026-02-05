/**
 * Surface Detector - WebXR Plane Detection
 * Detects and tracks horizontal table surfaces for AR placement
 */

class SurfaceDetector {
    constructor(scene) {
        this.scene = scene;
        this.detectedPlanes = [];
        this.activeSurface = null;
        this.surfaceMesh = null;
        this.updateInterval = 100; // Update every 100ms (10fps)
        this.lastUpdate = 0;
    }

    /**
     * Detect horizontal planes using WebXR
     * @param {XRFrame} frame - Current XR frame
     * @param {XRReferenceSpace} referenceSpace - XR reference space
     */
    async detectPlanes(frame, referenceSpace) {
        const now = Date.now();
        if (now - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = now;

        if (!frame || !frame.detectedPlanes) {
            console.warn('WebXR plane detection not available');
            return;
        }

        // Get all detected planes
        const planes = frame.detectedPlanes;

        // Filter for horizontal surfaces (tables, floors)
        const horizontalPlanes = [];

        planes.forEach(plane => {
            const pose = frame.getPose(plane.planeSpace, referenceSpace);
            if (!pose) return;

            // Check if plane is horizontal (normal pointing up)
            const normal = new THREE.Vector3(0, 1, 0);
            const planeNormal = new THREE.Vector3(
                pose.transform.orientation.x,
                pose.transform.orientation.y,
                pose.transform.orientation.z
            );

            const angle = normal.angleTo(planeNormal);
            const isHorizontal = Math.abs(angle) < 0.3; // ~17 degrees tolerance

            if (isHorizontal && plane.polygon) {
                horizontalPlanes.push({
                    id: plane.lastChangedTime,
                    polygon: Array.from(plane.polygon),
                    pose: pose,
                    orientation: plane.orientation
                });
            }
        });

        // Calculate bounds and area for each plane
        this.detectedPlanes = horizontalPlanes.map(plane => {
            const bounds = this.calculateBounds(plane.polygon, plane.pose);
            const area = this.calculateArea(plane.polygon);

            return {
                ...plane,
                bounds,
                area
            };
        });

        // Select largest surface as active table
        if (this.detectedPlanes.length > 0) {
            this.activeSurface = this.detectedPlanes.reduce((max, p) =>
                p.area > max.area ? p : max
            );

            console.log(`Active surface: ${this.activeSurface.area.toFixed(2)}m²`);
        }
    }

    /**
     * Calculate 3D bounding box from polygon points
     */
    calculateBounds(polygon, pose) {
        if (!polygon || polygon.length === 0) {
            return { minX: 0, maxX: 0, minZ: 0, maxZ: 0, centerY: 0 };
        }

        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        // Transform polygon points to world space
        polygon.forEach(point => {
            const worldPoint = new THREE.Vector3(point.x, point.y, point.z);
            worldPoint.applyMatrix4(new THREE.Matrix4().fromArray(pose.transform.matrix));

            minX = Math.min(minX, worldPoint.x);
            maxX = Math.max(maxX, worldPoint.x);
            minZ = Math.min(minZ, worldPoint.z);
            maxZ = Math.max(maxZ, worldPoint.z);
        });

        return {
            minX,
            maxX,
            minZ,
            maxZ,
            centerY: pose.transform.position.y,
            width: maxX - minX,
            depth: maxZ - minZ
        };
    }

    /**
     * Calculate surface area
     */
    calculateArea(polygon) {
        if (!polygon || polygon.length < 3) return 0;

        // Shoelace formula for polygon area
        let area = 0;
        for (let i = 0; i < polygon.length; i++) {
            const j = (i + 1) % polygon.length;
            area += polygon[i].x * polygon[j].z;
            area -= polygon[j].x * polygon[i].z;
        }

        return Math.abs(area / 2);
    }

    /**
     * Create visual mesh for detected surface (debugging)
     */
    visualizeSurface() {
        // Remove old mesh
        if (this.surfaceMesh) {
            this.scene.remove(this.surfaceMesh);
        }

        if (!this.activeSurface) return null;

        const bounds = this.activeSurface.bounds;

        // Create plane geometry
        const geometry = new THREE.PlaneGeometry(bounds.width, bounds.depth);

        // Semi-transparent green material
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            opacity: 0.2,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Position at surface center
        mesh.position.set(
            (bounds.minX + bounds.maxX) / 2,
            bounds.centerY,
            (bounds.minZ + bounds.maxZ) / 2
        );

        // Rotate to horizontal
        mesh.rotation.x = -Math.PI / 2;

        // Add edge outline
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
        );
        mesh.add(line);

        this.surfaceMesh = mesh;
        return mesh;
    }

    /**
     * Get surface center point
     */
    getSurfaceCenter() {
        if (!this.activeSurface) return null;

        const bounds = this.activeSurface.bounds;
        return new THREE.Vector3(
            (bounds.minX + bounds.maxX) / 2,
            bounds.centerY,
            (bounds.minZ + bounds.maxZ) / 2
        );
    }

    /**
     * Check if point is within surface bounds
     */
    isPointOnSurface(point) {
        if (!this.activeSurface) return false;

        const bounds = this.activeSurface.bounds;
        return (
            point.x >= bounds.minX &&
            point.x <= bounds.maxX &&
            point.z >= bounds.minZ &&
            point.z <= bounds.maxZ
        );
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SurfaceDetector;
}
