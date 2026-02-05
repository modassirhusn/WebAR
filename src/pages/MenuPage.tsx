import { useNavigate } from 'react-router-dom';
import { CATEGORIES, getFoodsByCategory, FoodItem } from '../data/foodData';
import styles from './MenuPage.module.css';

export default function MenuPage() {
    const navigate = useNavigate();

    const handleDishClick = (food: FoodItem) => {
        navigate(`/dish/${food.id}`);
    };

    return (
        <div className={`page ${styles.menuPage}`}>
            <header className="page-header">
                <h1 className="page-title">Menu</h1>
                <p className="page-subtitle">Explore our curated selection</p>
            </header>

            <div className={styles.categories}>
                {CATEGORIES.map((category) => (
                    <section key={category.id} className={styles.category}>
                        <h2 className={styles.categoryTitle}>
                            <span className={styles.categoryIcon}>{category.icon}</span>
                            {category.name}
                        </h2>

                        <div className={styles.items}>
                            {getFoodsByCategory(category.id).map((food, index) => (
                                <button
                                    key={food.id}
                                    className={`card card-interactive ${styles.item}`}
                                    onClick={() => handleDishClick(food)}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
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
        </div>
    );
}
