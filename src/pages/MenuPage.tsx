import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, getFoodsByCategory, FoodItem, FOODS } from '../data/foodData';
import styles from './MenuPage.module.css';

export default function MenuPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleDishClick = (food: FoodItem) => {
        navigate(`/dish/${food.id}`);
    };

    // Filter foods based on search query
    const searchResults = useMemo((): FoodItem[] | null => {
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase().trim();
        return FOODS.filter((food: FoodItem) =>
            food.name.toLowerCase().includes(query) ||
            food.ingredients.some((ing: string) => ing.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Search happens automatically via useMemo
    };

    return (
        <div className={`page ${styles.menuPage}`}>
            <header className="page-header">
                <h1 className="page-title">Menu</h1>
                <p className="page-subtitle">Explore our curated selection</p>
            </header>

            {/* Search Section */}
            {isSearching && (
                <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
                    <div className={styles.searchInputWrapper}>
                        <svg
                            className={styles.searchInputIcon}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
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
                            <button
                                type="button"
                                className={styles.clearBtn}
                                onClick={() => setSearchQuery('')}
                            >
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
                                <button
                                    key={food.id}
                                    className={styles.item}
                                    onClick={() => handleDishClick(food)}
                                >
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
                    {CATEGORIES.map((category) => {
                        const foods = getFoodsByCategory(category.id);
                        return (
                            <section key={category.id}>
                                <h2 className={styles.categoryTitle}>
                                    <span className={styles.categoryIcon}>{category.icon}</span>
                                    {category.name}
                                </h2>

                                <div className={styles.items}>
                                    {foods.length === 0 ? (
                                        <p style={{ color: 'red' }}>No items found for {category.name}</p>
                                    ) : (
                                        foods.map((food) => (
                                            <button
                                                key={food.id}
                                                className={styles.item}
                                                onClick={() => handleDishClick(food)}
                                            >
                                                <div className={styles.itemInfo}>
                                                    <div className={`veg-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} />
                                                    <span className={styles.itemName}>{food.name}</span>
                                                </div>
                                                <span className={styles.itemPrice}>₹{food.price}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            {/* Search Toggle Button - fixed at top */}
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
