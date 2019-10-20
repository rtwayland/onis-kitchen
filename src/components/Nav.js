import React from 'react';
import styled from '@emotion/styled';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
// import { refreshRecipes } from '../utils/api';

const Nav = ({ isAuthenticated, isAdmin, handleLogout, history, location }) => {
  const { pathname } = location;
  const navigate = (path) => history.push(path);
  return isAuthenticated ? (
    <NavBar>
      <Menu secondary>
        <HomeLink className="handwriting" to="/">
          Oni&apos;s Kitchen
        </HomeLink>
        <Menu.Item
          name="Search"
          active={pathname === '/'}
          onClick={() => navigate('/')}
        />
        <Menu.Item
          name="All Recipes"
          active={pathname === '/recipes'}
          onClick={() => navigate('/recipes')}
        />
        <Menu.Item
          name="Favorites"
          active={pathname === '/favorites'}
          onClick={() => navigate('/favorites')}
        />
        {isAdmin && (
          <Menu.Item
            name="Create Recipe"
            active={pathname === '/new-recipe'}
            onClick={() => navigate('/new-recipe')}
          />
        )}
        <Menu.Menu position="right">
          <Menu.Item name="logout" onClick={handleLogout} />
        </Menu.Menu>
      </Menu>
    </NavBar>
  ) : (
    <NavBar>
      <Menu secondary>
        <HomeLink className="handwriting" to="/">
          Oni&apos;s Kitchen
        </HomeLink>
        <Menu.Menu position="right">
          <Menu.Item
            name="Sign up"
            active={pathname === '/signup'}
            onClick={() => navigate('/signup')}
          />
          <Menu.Item
            name="Login"
            active={pathname === '/login'}
            onClick={() => navigate('/login')}
          />
        </Menu.Menu>
      </Menu>
    </NavBar>
  );
};

const NavBar = styled.nav({
  padding: '5px 10px',
  borderBottom: '1px solid #ccc',
  marginBottom: 20,
});

const HomeLink = styled(Link)({
  fontSize: 25,
  margin: '15px 10px 0 10px',
  color: '#272727',
  '&:hover': {
    color: '#272727',
  },
});

export default withRouter(Nav);

// <button type="button" onClick={() => refreshRecipes()}>
//   Refresh Recipes
// </button>
