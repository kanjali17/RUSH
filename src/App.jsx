import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import InterestsPage from './pages/InterestsPage';
import CampusSelectPage from './pages/CampusSelectPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PopupDetailPage from './pages/PopupDetailPage';
import TrendingPage from './pages/TrendingPage';
import FollowingPage from './pages/FollowingPage';
import ProfilePage from './pages/ProfilePage';
import CreatorDashboard from './pages/CreatorDashboard';
import CreatePopupPage from './pages/CreatePopupPage';
import AttendancePage from './pages/AttendancePage';
import ReviewsPage from './pages/ReviewsPage';

function ProtectedRoute({ children, requireCampus = false }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  if (requireCampus && !currentUser.campus_id) return <Navigate to="/campus" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/interests"
          element={
            <ProtectedRoute>
              <InterestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campus"
          element={
            <ProtectedRoute>
              <CampusSelectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute requireCampus>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute requireCampus>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/popup/:id"
          element={
            <ProtectedRoute requireCampus>
              <PopupDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trending"
          element={
            <ProtectedRoute requireCampus>
              <TrendingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/following"
          element={
            <ProtectedRoute requireCampus>
              <FollowingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireCampus>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator"
          element={
            <ProtectedRoute requireCampus>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/new"
          element={
            <ProtectedRoute requireCampus>
              <CreatePopupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/attendance/:id"
          element={
            <ProtectedRoute requireCampus>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/:id"
          element={
            <ProtectedRoute requireCampus>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />
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
