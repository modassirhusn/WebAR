import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById } from '../data/foodData';
import { useCart } from '../contexts/CartContext';
import styles from './ARPage.module.css';

export default function ARPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const food = getFoodById(id || '');

    const videoRef = useRef<HTMLVideoElement>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!food) return;
        startCamera();
        return () => stopCamera();
    }, [food]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Camera error:', err);
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    const handleAddToOrder = () => {
        if (food) {
            addItem(food, quantity);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const handleBack = () => {
        stopCamera();
        navigate(`/dish/${id}`);
    };

    if (!food) {
        return (
            <div className="page flex items-center justify-center">
                <p>Dish not found</p>
            </div>
        );
    }

    return (
        <div className={styles.arView}>
            {/* Camera Feed */}
            <video ref={videoRef} className={styles.cameraFeed} autoPlay playsInline muted />

            {/* 3D Model Overlay */}
            <div className={styles.modelContainer}>
                <model-viewer
                    src={food.model}
                    camera-controls
                    shadow-intensity="1"
                    exposure="1"
                    camera-orbit="0deg 75deg 2m"
                    min-camera-orbit="auto auto 0.5m"
                    max-camera-orbit="auto auto 4m"
                    className={styles.modelViewer}
                />
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className={styles.loading}>
                    <div className="spinner" />
                    <p>Loading AR view...</p>
                </div>
            )}

            {/* AR Overlay UI */}
            <div className={styles.overlay}>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={handleBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className={styles.dishName}>{food.name}</h2>
                </div>

                {/* Nutrition Specs */}
                <div className={styles.specs}>
                    <div className={styles.specItem}>
                        <span className={styles.specValue}>{food.protein}</span>
                        <span className={styles.specLabel}>Protein</span>
                    </div>
                    <div className={styles.specItem}>
                        <span className={styles.specValue}>{food.carbs}</span>
                        <span className={styles.specLabel}>Carbs</span>
                    </div>
                    <div className={styles.specItem}>
                        <span className={styles.specValue}>{food.fiber}</span>
                        <span className={styles.specLabel}>Fiber</span>
                    </div>
                </div>

                {/* Ingredients */}
                <div className={styles.ingredients}>
                    <h3>Ingredients</h3>
                    <ul>
                        {food.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                        ))}
                    </ul>
                </div>

                {/* Order Panel */}
                <div className={styles.orderPanel}>
                    <div className={styles.quantityControl}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button className={`btn btn-primary ${styles.orderBtn}`} onClick={handleAddToOrder}>
                        Add to Order • ₹{food.price * quantity}
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="toast">
                    ✓ Added {quantity}× {food.name} to order
                </div>
            )}
        </div>
    );
}
