import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

// User's food images with removed backgrounds
const FOOD_IMAGES = [
    '/images/loading/Gemini_Generated_Image_i5nanyi5nanyi5na-removebg-preview.png',  // Egg
    '/images/loading/burger-removebg-preview.png',  // Burger
    '/images/loading/Gemini_Generated_Image_id1pqgid1pqgid1p-removebg-preview.png',  // Cola
];

interface LoadingScreenProps {
    onComplete?: () => void;
    minDuration?: number;
}

export default function LoadingScreen({ onComplete, minDuration = 2500 }: LoadingScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setIsVisible(false);
                onComplete?.();
            }, 500);
        }, minDuration);

        return () => clearTimeout(timer);
    }, [minDuration, onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}>
            {/* Background gradient orbs */}
            <div className={styles.backgroundOrbs}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
                <div className={styles.orb3} />
            </div>

            {/* Main content - just the floating food icons, no text */}
            <div className={styles.content}>
                <div className={styles.foodContainer}>
                    {FOOD_IMAGES.map((img, index) => (
                        <div
                            key={index}
                            className={styles.foodItem}
                            style={{
                                animationDelay: `${index * 0.25}s`,
                            }}
                        >
                            <img
                                src={img}
                                alt={`Food ${index + 1}`}
                                className={styles.foodImage}
                            />
                            <div className={styles.shadow} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
