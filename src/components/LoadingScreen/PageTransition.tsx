import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './LoadingScreen.module.css';

// User's food images with removed backgrounds
const FOOD_IMAGES = [
    '/images/loading/Gemini_Generated_Image_i5nanyi5nanyi5na-removebg-preview.png',
    '/images/loading/burger-removebg-preview.png',
    '/images/loading/Gemini_Generated_Image_id1pqgid1pqgid1p-removebg-preview.png',
];

interface PageTransitionProps {
    children: React.ReactNode;
    duration?: number;
}

export default function PageTransition({ children, duration = 800 }: PageTransitionProps) {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [displayLocation, setDisplayLocation] = useState(location);

    useEffect(() => {
        // Don't show loading on initial render
        if (displayLocation.pathname === location.pathname) return;

        // Show loading screen
        setIsLoading(true);

        // After duration, hide loading and update location
        const timer = setTimeout(() => {
            setDisplayLocation(location);
            setIsLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [location, displayLocation.pathname, duration]);

    return (
        <>
            {/* Page transition loading overlay */}
            {isLoading && (
                <div className={styles.loadingScreen}>
                    <div className={styles.backgroundOrbs}>
                        <div className={styles.orb1} />
                        <div className={styles.orb2} />
                        <div className={styles.orb3} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.foodContainer}>
                            {FOOD_IMAGES.map((img, index) => (
                                <div
                                    key={index}
                                    className={styles.foodItem}
                                    style={{ animationDelay: `${index * 0.2}s` }}
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
            )}
            {/* Page content */}
            {children}
        </>
    );
}
