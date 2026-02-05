import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import styles from './Navigation.module.css';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/menu', label: 'Menu', icon: '🍽️' },
    { path: '/hotel', label: 'Hotel', icon: '🏨' },
    { path: '/feedback', label: 'Contact', icon: '💬' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems } = useCart();

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    // Hide navigation on scanner (home) and AR pages
    if (location.pathname === '/' || location.pathname.startsWith('/ar')) {
        return null;
    }

    return (
        <>
            {/* Hamburger Button */}
            <button
                className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <span />
                <span />
                <span />
            </button>

            {/* Cart Badge */}
            {totalItems > 0 && (
                <div className={styles.cartBadge}>
                    {totalItems}
                </div>
            )}

            {/* Overlay */}
            {isOpen && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)} />
            )}

            {/* Slide Menu */}
            <nav className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Menu</h2>
                    <button className={styles.close} onClick={() => setIsOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.links}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.path}
                            className={`${styles.link} ${location.pathname === item.path ? styles.active : ''}`}
                            onClick={() => handleNavigate(item.path)}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.footer}>
                    <p>Reality Dining</p>
                    <p className={styles.tagline}>See before you order</p>
                </div>
            </nav>
        </>
    );
}
