import React from 'react';
import { Switch } from 'react-router-dom';
import Login from './Login';
import AppliedRoute from './AppliedRoute';
import Home from './Home';
import Signup from './Signup';
import NewRecipeForm from './NewRecipe';
import Recipe from './Recipe';
import AllRecipes from '../pages/AllRecipes';
import FavoriteRecipes from '../pages/FavoriteRecipes';

const Routes = ({ appProps }) => {
  return (
    <Switch>
      <AppliedRoute exact path="/" component={Home} appProps={appProps} />
      <AppliedRoute exact path="/login" component={Login} appProps={appProps} />
      <AppliedRoute
        exact
        path="/signup"
        component={Signup}
        appProps={appProps}
      />
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
};

export default Routes;
