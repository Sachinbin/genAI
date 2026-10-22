import React, { useContext } from 'react'
import { AuthContext } from '../contexts/authContext';
import { Navigate, Outlet, useNavigate } from 'react-router';
import { useCurrentUser } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { data: user, isLoading , isError} = useCurrentUser();

   if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute