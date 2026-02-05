import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ScannerPage.module.css';

export default function ScannerPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasCamera, setHasCamera] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        } catch (err) {
            console.error('Camera error:', err);
            setHasCamera(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            stopCamera();
            navigate('/menu');
        }, 1500);
    };

    return (
        <div className={styles.scanner}>
            {hasCamera ? (
                <video ref={videoRef} className={styles.video} autoPlay playsInline muted />
            ) : (
                <div className={styles.noCamera}>
                    <p>Camera unavailable</p>
                </div>
            )}

            <div className={styles.overlay}>
                <div className={styles.frame}>
                    <div className={styles.corner} data-pos="tl" />
                    <div className={styles.corner} data-pos="tr" />
                    <div className={styles.corner} data-pos="bl" />
                    <div className={styles.corner} data-pos="br" />
                    {isScanning && <div className={styles.scanLine} />}
                </div>

                <div className={styles.content}>
                    <h1>Scan Menu QR</h1>
                    <p>Point your camera at the table QR code</p>

                    <button
                        className={`btn btn-primary ${styles.scanBtn}`}
                        onClick={handleScan}
                        disabled={isScanning}
                    >
                        {isScanning ? (
                            <>
                                <span className="spinner" />
                                Scanning...
                            </>
                        ) : (
                            'Demo: Simulate Scan'
                        )}
                    </button>
                </div>

                <div className={styles.branding}>
                    <p className={styles.title}>Reality Dining</p>
                    <p className={styles.tagline}>See before you order</p>
                </div>
            </div>
        </div>
    );
}
