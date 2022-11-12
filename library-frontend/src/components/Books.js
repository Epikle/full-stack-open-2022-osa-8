import { useQuery } from '@apollo/client';

import { GET_BOOKS } from '../queries';

const Books = ({ show }) => {
  const result = useQuery(GET_BOOKS);

  if (!show) return null;
  if (result.loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;