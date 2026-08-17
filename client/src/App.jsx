import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import LoadingScreen from './components/common/LoadingScreen.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicRoute from './routes/PublicRoute.jsx';

const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const MyItemsPage = lazy(() => import('./pages/MyItemsPage.jsx'));
const MyAssignedPage = lazy(() => import('./pages/MyAssignedPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<PublicRoute><AuthPage mode="login" /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><AuthPage mode="register" /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/my-items" element={<ProtectedRoute><MyItemsPage /></ProtectedRoute>} />
            <Route path="/my-assigned" element={<ProtectedRoute><MyAssignedPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
