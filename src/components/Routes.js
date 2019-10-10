import React from 'react';
import { Switch } from 'react-router-dom';
import Login from './Login';
import AppliedRoute from './AppliedRoute';
import Home from './Home';
import Signup from './Signup';
import NewRecipeForm from './NewRecipe';
import RecipeList from './RecipeList';
import Recipe from './Recipe';

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
        path="/recipes"
        component={RecipeList}
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
        path="/recipes/new"
        component={NewRecipeForm}
        appProps={appProps}
        isProtected
      />
    </Switch>
  );
};

export default Routes;
