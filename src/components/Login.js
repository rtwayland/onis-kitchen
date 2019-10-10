import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { Auth } from 'aws-amplify';
import useFormFields from '../hooks/useFormFields';

const Login = ({ userHasAuthenticated, history, location }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      const { state } = location;
      const redirectPath = state && state.from ? state.from : '/';
      history.push(redirectPath);
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  }

  return (
    <div style={{ width: 300, margin: 'auto' }}>
      <Form loading={isLoading} onSubmit={handleSubmit}>
        <Form.Input
          autoFocus
          type="email"
          id="email"
          label="Email"
          placeholder="Email"
          value={fields.email}
          onChange={handleFieldChange}
        />
        <Form.Input
          value={fields.password}
          id="password"
          label="Password"
          placeholder="Password"
          onChange={handleFieldChange}
          type="password"
        />
        <Button disabled={!validateForm()} type="submit">
          Login
        </Button>
      </Form>
      {errorMessage && <Message error content={errorMessage} />}
    </div>
  );
};
export default Login;
