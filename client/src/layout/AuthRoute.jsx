import React, { useContext } from 'react'
import { AuthContext } from '../contexts/authContext';
import { Navigate, Outlet } from 'react-router';
import { useCurrentUser } from '../hooks/useAuth';

const AuthRoute = () => {
    const { data: user, isLoading, isError } = useCurrentUser();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" />;
    }
    return <Outlet />;
}     



export default AuthRoute