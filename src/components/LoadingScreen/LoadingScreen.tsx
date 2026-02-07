import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

// User's food images
const FOOD_IMAGES = [
    '/images/loading/Gemini_Generated_Image_90yt9d90yt9d90yt.png',  // Egg
    '/images/loading/Gemini_Generated_Image_i5nanyi5nanyi5na.png',  // Burger
    '/images/loading/Gemini_Generated_Image_id1pqgid1pqgid1p.png',  // Cola
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

            {/* Main content */}
            <div className={styles.content}>
                {/* 3D Floating food icons */}
                <div className={styles.foodContainer}>
                    {FOOD_IMAGES.map((img, index) => (
                        <div
                            key={index}
                            className={styles.foodItem}
                            style={{
                                animationDelay: `${index * 0.2}s`,
                            }}
                        >
                            <img
                                src={img}
                                alt={`Food ${index + 1}`}
                                className={styles.foodImage}
                            />
                            {/* Shadow under each item */}
                            <div className={styles.shadow} />
                        </div>
                    ))}
                </div>

                {/* Loading text */}
                <div className={styles.loadingText}>
                    <span>L</span>
                    <span>o</span>
                    <span>a</span>
                    <span>d</span>
                    <span>i</span>
                    <span>n</span>
                    <span>g</span>
                    <span className={styles.dots}>...</span>
                </div>
            </div>
        </div>
    );
}
