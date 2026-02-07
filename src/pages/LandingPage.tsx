import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/scan');
    };

    return (
        <div className={styles.landingPage}>
            {/* Animated background */}
            <div className={styles.bgEffects}>
                <div className={styles.gradientOrb1} />
                <div className={styles.gradientOrb2} />
                <div className={styles.gradientOrb3} />
            </div>

            {/* Main content */}
            <div className={styles.content}>
                {/* Animated Loader at top/middle */}
                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>

                {/* Text content - above Get Started button */}
                <div className={styles.textContent}>
                    <h1 className={styles.brandName}>Reality Dining</h1>
                    <h2 className={styles.tagline}>
                        See Your Food<br />
                        <span className={styles.highlight}>Before You Order</span>
                    </h2>
                    <p className={styles.description}>
                        Experience restaurant dishes in stunning AR.
                        Scan the menu, view in 3D, and order with confidence.
                    </p>
                </div>

                {/* CTA Button */}
                <button className={styles.ctaButton} onClick={handleGetStarted}>
                    <span>Get Started</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Powered by WebAR Technology</p>
                </div>
            </div>
        </div>
    );
}
