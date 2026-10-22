import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/AI/Dashboard';
import ProtectedRoute from '../layout/ProtectedRoute';
import AuthRoute from '../layout/AuthRoute';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { element: <AuthRoute />, children: [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
  ] },
  { element: <ProtectedRoute />, children: [
    { path: '/dashboard', element: <Dashboard /> },
  ] },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
