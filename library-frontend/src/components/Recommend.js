import { useQuery } from '@apollo/client';

import { GET_BOOKS } from '../queries';

const Recommend = ({ show, userData }) => {
  const { data, loading } = useQuery(GET_BOOKS, {
    variables: { selectedGenre: userData?.me?.favoriteGenre },
  });

  if (!show || !userData) {
    return null;
  }

  if (loading) {
    <p>loading...</p>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre{' '}
        <strong>{userData.me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
