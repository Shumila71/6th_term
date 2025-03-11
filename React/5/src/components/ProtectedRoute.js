import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAuthenticated, hasRole } from '../utils/auth';

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const { user } = useSelector((state) => state.auth);
  const isAllowed = isAuthenticated(user) && hasRole(user, roles);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAllowed ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;