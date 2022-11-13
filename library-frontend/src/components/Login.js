import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import { LOGIN } from '../queries';

const Login = ({ show, setToken, setShow }) => {
  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error);
    },
    onCompleted: () => {
      setUsername('');
      setpassword('');
      setShow('authors');
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('osa8-token', token);
    }
  }, [result.data]); //eslint-disable-line

  const loginHandler = async (event) => {
    event.preventDefault();

    await login({ variables: { username, password } });
  };

  if (!show) return null;

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={loginHandler}>
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <br />
        <button>login</button>
      </form>
    </div>
  );
};

export default Login;
