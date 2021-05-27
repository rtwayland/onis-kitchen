import React from 'react';
import { Switch } from 'react-router-dom';
import Login from '../pages/Login';
import AppliedRoute from './AppliedRoute';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import NewRecipeForm from '../pages/NewRecipe';
import Recipe from '../pages/Recipe';
import AllRecipes from '../pages/AllRecipes';
import FavoriteRecipes from '../pages/FavoriteRecipes';

const Routes = ({ appProps }) => (
  <Switch>
    <AppliedRoute exact path="/" component={Home} appProps={appProps} />
    <AppliedRoute exact path="/login" component={Login} appProps={appProps} />
    <AppliedRoute exact path="/signup" component={Signup} appProps={appProps} />
    <AppliedRoute
      exact
      path="/favorites"
      component={FavoriteRecipes}
      appProps={appProps}
      isProtected
    />
    <AppliedRoute
      exact
      path="/recipes"
      component={AllRecipes}
      appProps={appProps}
      isProtected
    />
    <AppliedRoute
      path="/recipes/:id"
      exact
      component={Recipe}
      appProps={appProps}
    />
    <AppliedRoute
      exact
      path="/new-recipe"
      component={NewRecipeForm}
      appProps={appProps}
      isProtected
    />
  </Switch>
);

export default Routes;
