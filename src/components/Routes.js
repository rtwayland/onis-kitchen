import React from 'react';
import { Switch } from 'react-router-dom';
import Login from './Login';
import AppliedRoute from './AppliedRoute';
import Home from './Home';
import Signup from './Signup';

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
    </Switch>
  );
};

export default Routes;
