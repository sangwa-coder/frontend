import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
    const isAuthorized = useAuth(role);

    return isAuthorized ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
