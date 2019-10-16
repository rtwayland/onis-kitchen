import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Amplify from 'aws-amplify';
import config from './config';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';

const { apiGateway, cognito, s3 } = config;

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: cognito.REGION,
    userPoolId: cognito.USER_POOL_ID,
    identityPoolId: cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: s3.REGION,
    bucket: s3.BUCKET,
  },
  API: {
    endpoints: [
      {
        name: 'recipes',
        endpoint: apiGateway.URL,
        region: apiGateway.REGION,
      },
      {
        name: 'userRecipeData',
        endpoint: apiGateway.URL,
        region: apiGateway.REGION,
      },
    ],
  },
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
