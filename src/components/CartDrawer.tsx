import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

    if (totalItems === 0 && !isOpen) {
        return null;
    }

    const handleOrder = () => {
        alert(`Order placed! Total: ₹${totalPrice}\n\nItems will be prepared and served to your table.`);
        clearCart();
        setIsOpen(false);
    };

    return (
        <>
            {/* Cart Button - fixed position */}
            <button
                className={styles.cartButton}
                onClick={() => setIsOpen(true)}
                aria-label="Open cart"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {totalItems > 0 && (
                    <span className={styles.badge}>{totalItems}</span>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)} />
            )}

            {/* Cart Drawer */}
            <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Your Cart</h2>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.empty}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className={styles.items}>
                            {items.map((item) => (
                                <div key={item.food.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <div className={`veg-indicator ${item.food.isVeg ? 'veg' : 'non-veg'}`} />
                                        <span className={styles.itemName}>{item.food.name}</span>
                                    </div>
                                    <div className={styles.itemRight}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                                                className={styles.qtyBtn}
                                            >
                                                −
                                            </button>
                                            <span className={styles.qty}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                                                className={styles.qtyBtn}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className={styles.itemPrice}>₹{item.food.price * item.quantity}</span>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeItem(item.food.id)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>Total</span>
                            <span className={styles.totalPrice}>₹{totalPrice}</span>
                        </div>
                        <button className={styles.orderBtn} onClick={handleOrder}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            Order to Hotel
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
