import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';

// Pages
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

export default function App() {
    const { isDark } = useTheme();

    return (
        <div className={`app ${isDark ? 'dark' : 'light'}`}>
            <ThemeToggle />
            <Navigation />

            <Routes>
                <Route path="/" element={<ScannerPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/dish/:id" element={<DishPage />} />
                <Route path="/ar/:id" element={<ARPage />} />
                <Route path="/hotel" element={<HotelPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}
