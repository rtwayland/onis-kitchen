import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { refreshRecipes } from '../utils/api';

const Nav = ({ isAuthenticated, handleLogout }) => {
  return (
    <Navbar>
      {isAuthenticated ? (
        <>
          <Link to="/">
            <div>Search Recipes</div>
          </Link>
          <button type="button" onClick={() => refreshRecipes()}>
            Refresh Recipes
          </button>
          <Link to="/recipes">
            <div>All Recipes</div>
          </Link>
          <Link to="/new-recipe">
            <div>New Recipe</div>
          </Link>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
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
