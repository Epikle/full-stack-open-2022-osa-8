import { useEffect, useState } from 'react';
import { useApolloClient, useQuery, useSubscription } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import Login from './components/Login';
import NewBook from './components/NewBook';
import Recommend from './components/Recommend';
import { ME, BOOK_ADDED } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const { data: userData, loading, refetch } = useQuery(ME);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data);
      alert('new book added');
      client.resetStore();
    },
  });

  const logoutHandler = () => {
    setToken(null);
    localStorage.clear();
    setPage('login');
    client.resetStore();
  };

  useEffect(() => {
    refetch();
  }, [refetch, token]);

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        {token && <button onClick={logoutHandler}>logout</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>
      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommend show={page === 'recommend'} userData={userData} />
      <Login show={page === 'login'} setToken={setToken} setShow={setPage} />
    </div>
  );
};

export default App;
