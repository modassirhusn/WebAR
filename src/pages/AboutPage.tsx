import styles from './AboutPage.module.css';

export default function AboutPage() {
    return (
        <div className={`page ${styles.aboutPage}`}>
            <div className={`card ${styles.card}`}>
                <h1 className={styles.title}>About Us</h1>
                <p className={styles.tagline}>"See before you order"</p>

                <div className={styles.content}>
                    <p>
                        Reality Dining revolutionizes how you experience restaurant menus.
                        Using cutting-edge WebAR technology, we let you see your food in 3D
                        before ordering — ensuring every dish meets your expectations.
                    </p>

                    <div className={styles.developer}>
                        <span className={styles.label}>Developed by</span>
                        <span className={styles.name}>Md Modassir Hussain</span>
                    </div>

                    <div className={styles.contact}>
                        <h3>Get in Touch</h3>
                        <p>📧 contact@diamondplaza.com</p>
                        <p>📞 +91 98765 43210</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
