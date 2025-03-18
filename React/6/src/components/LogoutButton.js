import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    isAuthenticated && (
      <button onClick={handleLogout}>Выйти</button>
    )
  );
};

export default LogoutButton;