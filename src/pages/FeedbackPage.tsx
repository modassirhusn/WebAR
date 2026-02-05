import { useState } from 'react';
import styles from './FeedbackPage.module.css';

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className={`page ${styles.feedbackPage}`}>
                <div className={`card ${styles.card} ${styles.success}`}>
                    <span className={styles.successIcon}>✓</span>
                    <h2>Thank You!</h2>
                    <p>Your feedback has been submitted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`page ${styles.feedbackPage}`}>
            <div className={`card ${styles.card}`}>
                <h1 className={styles.title}>Contact Us</h1>
                <p className={styles.tagline}>"See before you order"</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input type="text" placeholder="Your Name" required className={styles.input} />
                    <input type="email" placeholder="Email Address" required className={styles.input} />
                    <input type="tel" placeholder="Phone Number" className={styles.input} />

                    <div className={styles.ratingSection}>
                        <p className={styles.ratingLabel}>Rate Your Experience</p>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`${styles.star} ${rating >= star ? styles.active : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <textarea placeholder="Share your feedback..." rows={4} className={styles.textarea} />

                    <button type="submit" className="btn btn-primary">
                        Submit Feedback
                    </button>
                </form>

                <div className={styles.contactInfo}>
                    <h3>Visit Us</h3>
                    <p>Diamond Plaza Restaurant</p>
                    <p>5th Floor, Diamond Plaza</p>
                    <p>MG Road, Bangalore - 560001</p>

                    <h3>Reach Us</h3>
                    <p>Phone: +91 98765 43210</p>
                    <p>Email: contact@diamondplaza.com</p>
                </div>
            </div>
        </div>
    );
}
