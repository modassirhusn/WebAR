import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import ScannerPage from './pages/ScannerPage';
import MenuPage from './pages/MenuPage';
import DishPage from './pages/DishPage';
import ARPage from './pages/ARPage';
import HotelPage from './pages/HotelPage';
import FeedbackPage from './pages/FeedbackPage';
import AboutPage from './pages/AboutPage';

// Components
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import LoadingScreen, { PageTransition } from './components/LoadingScreen';

export default function App() {
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    return (
        <div className={`app ${isDark ? 'dark' : 'light'}`}>
            {/* Loading Screen - shows on initial load */}
            {isLoading && (
                <LoadingScreen
                    onComplete={handleLoadingComplete}
                    minDuration={2500}
                />
            )}

            <ThemeToggle />
            <Navigation />

            {/* PageTransition wraps Routes to show loading on page changes */}
            <PageTransition duration={600}>
                <Routes>
                    {/* New Landing Page as home */}
                    <Route path="/" element={<LandingPage />} />
                    {/* Scanner moved to /scan */}
                    <Route path="/scan" element={<ScannerPage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/dish/:id" element={<DishPage />} />
                    <Route path="/ar/:id" element={<ARPage />} />
                    <Route path="/hotel" element={<HotelPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </PageTransition>
        </div>
    );
}
