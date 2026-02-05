import styles from './HotelPage.module.css';

export default function HotelPage() {
    return (
        <div className={`page ${styles.hotelPage}`}>
            <div className={`card ${styles.card}`}>
                <h1 className={styles.name}>Diamond Plaza Restaurant</h1>
                <p className={styles.tagline}>Culinary transparency and pure craft since 2020</p>

                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <span className={styles.icon}>📍</span>
                        <div>
                            <span className={styles.label}>Location</span>
                            <span className={styles.value}>5th Floor, Diamond Plaza</span>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.icon}>🕐</span>
                        <div>
                            <span className={styles.label}>Hours</span>
                            <span className={styles.value}>11:00 AM - 11:00 PM</span>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.icon}>⭐</span>
                        <div>
                            <span className={styles.label}>Rating</span>
                            <span className={styles.value}>4.9 / 5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
