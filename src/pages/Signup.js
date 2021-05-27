import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { Auth } from 'aws-amplify';
import useFormFields from '../hooks/useFormFields';

const Signup = ({ userHasAuthenticated, history }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newUser, setNewUser] = useState(null);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });

  const validateForm = () =>
    fields.email.length > 0 &&
    fields.password.length > 0 &&
    fields.password === fields.confirmPassword;

  const validateConfirmationForm = () => fields.confirmationCode.length > 0;

  const handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push('/');
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const userInfo = {
      username: fields.email,
      password: fields.password,
    };

    try {
      const user = await Auth.signUp(userInfo);
      setIsLoading(false);
      setNewUser(user);
      setErrorMessage('');
    } catch (e) {
      switch (e.name) {
        case 'UsernameExistsException':
          await Auth.resendSignUp(fields.email);
          setNewUser(userInfo);
          break;
        default:
          setErrorMessage(e.message);
          break;
      }
      setIsLoading(false);
    }
  };
  const renderConfirmationForm = () => (
    <Form loading={isLoading} onSubmit={handleConfirmationSubmit}>
      <Form.Input
        autoFocus
        type="tel"
        id="confirmationCode"
        label="Confirmation Code"
        onChange={handleFieldChange}
        value={fields.confirmationCode}
      />
      <Message
        header="Verify Email"
        content="Please check your email for the code."
      />
      <Button type="submit" disabled={!validateConfirmationForm()}>
        Verify
      </Button>
    </Form>
  );

  const renderForm = () => (
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
        type="password"
        id="password"
        label="Password"
        placeholder="Password"
        value={fields.password}
        onChange={handleFieldChange}
      />
      <Form.Input
        type="password"
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm Password"
        value={fields.confirmPassword}
        onChange={handleFieldChange}
      />
      <Button type="submit" disabled={!validateForm()}>
        Signup
      </Button>
    </Form>
  );

  return (
    <div style={{ width: 300, margin: 'auto' }}>
      <h1 className="handwriting">Welcome!</h1>
      {newUser === null ? renderForm() : renderConfirmationForm()}
      {errorMessage && <Message error content={errorMessage} />}
    </div>
  );
};
export default Signup;
