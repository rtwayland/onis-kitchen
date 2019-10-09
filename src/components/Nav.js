import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const Nav = ({ isAuthenticated, handleLogout }) => {
  return (
    <Navbar>
      {isAuthenticated ? (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/signup">
            <div>Signup</div>
          </Link>
          <Link to="/login">
            <div>Login</div>
          </Link>
        </>
      )}
    </Navbar>
  );
};

const Navbar = styled.nav({
  display: 'flex',
  justifyContent: 'flex-end',
});

export default Nav;
