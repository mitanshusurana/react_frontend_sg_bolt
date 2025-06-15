import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;