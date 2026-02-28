import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import CampusSelectPage from './pages/CampusSelectPage';
import HomePage from './pages/HomePage';
import PopupDetailPage from './pages/PopupDetailPage';
import TrendingPage from './pages/TrendingPage';
import FollowingPage from './pages/FollowingPage';
import MyRsvpsPage from './pages/MyRsvpsPage';
import CreatorDashboard from './pages/CreatorDashboard';
import CreatePopupPage from './pages/CreatePopupPage';
import AttendancePage from './pages/AttendancePage';
import ReviewsPage from './pages/ReviewsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children, requireCampus = false, requireCreator = false }) {
    const { currentUser } = useApp();
    if (!currentUser) return <Navigate to="/" replace />;
    if (requireCampus && !currentUser.campus_id) return <Navigate to="/campus" replace />;
    if (requireCreator && currentUser.role !== 'creator') return <Navigate to="/home" replace />;
    return children;
}

function AppRoutes() {
    return (
        <div className="app-shell">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/campus" element={<ProtectedRoute><CampusSelectPage /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute requireCampus><HomePage /></ProtectedRoute>} />
                <Route path="/popup/:id" element={<ProtectedRoute requireCampus><PopupDetailPage /></ProtectedRoute>} />
                <Route path="/trending" element={<ProtectedRoute requireCampus><TrendingPage /></ProtectedRoute>} />
                <Route path="/following" element={<ProtectedRoute requireCampus><FollowingPage /></ProtectedRoute>} />
                <Route path="/my-rsvps" element={<ProtectedRoute requireCampus><MyRsvpsPage /></ProtectedRoute>} />
                <Route path="/creator" element={<ProtectedRoute requireCampus requireCreator><CreatorDashboard /></ProtectedRoute>} />
                <Route path="/creator/new" element={<ProtectedRoute requireCampus requireCreator><CreatePopupPage /></ProtectedRoute>} />
                <Route path="/creator/attendance/:id" element={<ProtectedRoute requireCampus requireCreator><AttendancePage /></ProtectedRoute>} />
                <Route path="/reviews/:id" element={<ProtectedRoute requireCampus><ReviewsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute requireCampus><ProfilePage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </BrowserRouter>
    );
}
