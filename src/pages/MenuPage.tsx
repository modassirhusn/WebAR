import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHotelById } from '../data/hotelData';
import { FoodItem } from '../data/foodData';
import styles from './MenuPage.module.css';

export default function MenuPage() {
    const navigate = useNavigate();
    const { hotelId } = useParams<{ hotelId: string }>();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Fetch hotel data based on URL param
    const hotel = useMemo(() => {
        if (!hotelId) return undefined;
        return getHotelById(hotelId);
    }, [hotelId]);

    // Handle "Hotel Not Found"
    useEffect(() => {
        if (hotelId && !hotel) {
            // Ideally redirect to a 404 or a landing page
            console.error(`Hotel ID "${hotelId}" not found`);
        }
    }, [hotelId, hotel]);

    const handleDishClick = (food: FoodItem) => {
        navigate(`/menu/${hotelId}/dish/${food.id}`);
    };

    // Filter foods based on search query
    const searchResults = useMemo((): FoodItem[] | null => {
        if (!hotel) return null;
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase().trim();
        return hotel.dishes.filter((food: FoodItem) =>
            food.name.toLowerCase().includes(query) ||
            food.ingredients.some((ing: string) => ing.toLowerCase().includes(query))
        );
    }, [searchQuery, hotel]);

    // Group dishes by category for the main view
    const groupedDishes = useMemo(() => {
        if (!hotel) return {};
        const groups: Record<string, FoodItem[]> = {};

        // Categories we know about from foodData, or just group by the string value
        hotel.dishes.forEach(dish => {
            if (!groups[dish.category]) {
                groups[dish.category] = [];
            }
            groups[dish.category].push(dish);
        });
        return groups;
    }, [hotel]);

    // Helper to format category names (e.g., 'north-indian' -> 'North Indian')
    const formatCategory = (cat: string) => {
        return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (!hotel) {
        return (
            <div className="page flex items-center justify-center">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Resturant Not Found</h2>
                    <p>Please check the QR code or URL.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`page ${styles.menuPage}`}>
            <header className="page-header">
                <h1 className="page-title">{hotel.name}</h1>
                <p className="page-subtitle">{hotel.description}</p>
            </header>

            {/* Search Section */}
            {isSearching && (
                <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.searchInputWrapper}>
                        <svg className={styles.searchInputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                        {searchQuery && (
                            <button type="button" className={styles.clearBtn} onClick={() => setSearchQuery('')}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </form>
            )}

            {/* Search Results */}
            {searchResults !== null ? (
                <div className={styles.searchResults}>
                    <h2 className={styles.categoryTitle}>
                        <span className={styles.categoryIcon}>🔍</span>
                        Search Results ({searchResults.length})
                    </h2>
                    <div className={styles.items}>
                        {searchResults.length === 0 ? (
                            <p className={styles.noResults}>No dishes found for "{searchQuery}"</p>
                        ) : (
                            searchResults.map((food: FoodItem) => (
                                <button key={food.id} className={styles.item} onClick={() => handleDishClick(food)}>
                                    <div className={styles.itemInfo}>
                                        <div className={`veg-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} />
                                        <span className={styles.itemName}>{food.name}</span>
                                    </div>
                                    <span className={styles.itemPrice}>₹{food.price}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                /* Categories */
                <div className={styles.categories}>
                    {Object.entries(groupedDishes).map(([category, foods]) => (
                        <section key={category}>
                            <h2 className={styles.categoryTitle}>
                                <span className={styles.categoryIcon}>🍽️</span>
                                {formatCategory(category)}
                            </h2>

                            <div className={styles.items}>
                                {foods.map((food) => (
                                    <button key={food.id} className={styles.item} onClick={() => handleDishClick(food)}>
                                        <div className={styles.itemInfo}>
                                            <div className={`veg-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} />
                                            <span className={styles.itemName}>{food.name}</span>
                                        </div>
                                        <span className={styles.itemPrice}>₹{food.price}</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}

            {/* Search Toggle Button */}
            <button
                className={styles.searchToggle}
                onClick={() => {
                    setIsSearching(!isSearching);
                    if (isSearching) setSearchQuery('');
                }}
                aria-label={isSearching ? 'Close search' : 'Open search'}
            >
                {isSearching ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                )}
            </button>
        </div>
    );
}
