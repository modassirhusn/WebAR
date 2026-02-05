import { useNavigate } from 'react-router-dom';
import { CATEGORIES, getFoodsByCategory, FoodItem } from '../data/foodData';
import styles from './MenuPage.module.css';

export default function MenuPage() {
    const navigate = useNavigate();

    const handleDishClick = (food: FoodItem) => {
        navigate(`/dish/${food.id}`);
    };

    // DEBUG: Log items count
    console.log('MenuPage: CATEGORIES =', CATEGORIES);
    CATEGORIES.forEach(cat => {
        const items = getFoodsByCategory(cat.id);
        console.log(`MenuPage: ${cat.name} has ${items.length} items`, items);
    });

    return (
        <div className={`page ${styles.menuPage}`}>
            <header className="page-header">
                <h1 className="page-title">Menu</h1>
                <p className="page-subtitle">Explore our curated selection</p>
            </header>

            <div className={styles.categories}>
                {CATEGORIES.map((category) => {
                    const foods = getFoodsByCategory(category.id);
                    console.log(`Rendering category: ${category.name}, foods:`, foods.length);

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
        </div>
    );
}
