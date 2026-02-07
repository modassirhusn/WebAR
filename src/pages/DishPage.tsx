import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById } from '../data/foodData';
import { useCart } from '../contexts/CartContext';
import CartCounter from '../components/CartCounter';
import styles from './DishPage.module.css';

export default function DishPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const food = getFoodById(id || '');
    const { getItemQuantity, addItem, removeItem } = useCart();

    if (!food) {
        return (
            <div className="page flex items-center justify-center">
                <p>Dish not found</p>
            </div>
        );
    }

    const quantity = getItemQuantity(food.id);

    return (
        <div className={`page ${styles.dishPage}`}>
            <button className={styles.backBtn} onClick={() => navigate('/menu')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Menu
            </button>

            <div className={styles.imageWrapper}>
                <img src={food.image} alt={food.name} className={styles.image} />
                <div className={`veg-indicator ${food.isVeg ? 'veg' : 'non-veg'} ${styles.vegBadge}`} />
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.name}>{food.name}</h1>
                    <span className={styles.price}>₹{food.price}</span>
                </div>

                <div className={styles.nutrition}>
                    <div className={styles.nutrientCard}>
                        <span className={styles.nutrientValue}>{food.protein}</span>
                        <span className={styles.nutrientLabel}>Protein</span>
                    </div>
                    <div className={styles.nutrientCard}>
                        <span className={styles.nutrientValue}>{food.carbs}</span>
                        <span className={styles.nutrientLabel}>Carbs</span>
                    </div>
                    <div className={styles.nutrientCard}>
                        <span className={styles.nutrientValue}>{food.fiber}</span>
                        <span className={styles.nutrientLabel}>Fiber</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Ingredients</h2>
                    <ul className={styles.ingredients}>
                        {food.ingredients.map((ingredient, i) => (
                            <li key={i} className={styles.ingredient}>
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action buttons row */}
                <div className={styles.actionRow}>
                    {/* 3D Neumorphic Cart Counter */}
                    <CartCounter
                        quantity={quantity}
                        onAdd={() => addItem(food)}
                        onRemove={() => removeItem(food.id)}
                    />

                    {/* View in AR button */}
                    <button
                        className={`btn btn-primary ${styles.arBtn}`}
                        onClick={() => navigate(`/ar/${food.id}`)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        View in AR
                    </button>
                </div>
            </div>
        </div>
    );
}
