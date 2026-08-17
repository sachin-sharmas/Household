import { Navigate } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;

  return children;
}
