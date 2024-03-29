import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';

const AppliedRoute = ({
  component: Component,
  appProps,
  location,
  isProtected,
  ...rest
}) => {
  const isAllowed = !isProtected || (isProtected && appProps.isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAllowed ? (
          <Component {...props} {...appProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default withRouter(AppliedRoute);
