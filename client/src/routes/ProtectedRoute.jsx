import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
