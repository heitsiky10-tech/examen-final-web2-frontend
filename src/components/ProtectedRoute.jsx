import { Navigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = authApi.getCurrentUser();
  const token = localStorage.getItem('token');

  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

export default ProtectedRoute;