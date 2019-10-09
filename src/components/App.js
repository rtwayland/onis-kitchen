import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Nav from './Nav';
import Routes from './Routes';

const App = ({ history }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        console.log(e);
      }
    }

    setIsAuthenticating(false);
  }
  const logout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push('/login');
  };
  return (
    !isAuthenticating && (
      <div>
        <Nav isAuthenticated={isAuthenticated} handleLogout={logout} />
        <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
    )
  );
};

export default withRouter(App);
