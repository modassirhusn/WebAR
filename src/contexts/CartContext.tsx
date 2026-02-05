import { createContext, useContext, useState, ReactNode } from 'react';
import { FoodItem } from '../data/foodData';

interface CartItem {
    food: FoodItem;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (food: FoodItem, quantity?: number) => void;
    removeItem: (foodId: string) => void;
    updateQuantity: (foodId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (food: FoodItem, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.food.id === food.id);
            if (existing) {
                return prev.map((item) =>
                    item.food.id === food.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { food, quantity }];
        });
    };

    const removeItem = (foodId: string) => {
        setItems((prev) => prev.filter((item) => item.food.id !== foodId));
    };

    const updateQuantity = (foodId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(foodId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.food.id === foodId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.food.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
