import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { GET_BOOKS } from '../queries';

const Books = ({ show }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { data, loading } = useQuery(GET_BOOKS, {
    variables: { selectedGenre },
  });

  useEffect(() => {
    if (data?.allBooks && !selectedGenre) {
      const genreList = new Set();
      data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => {
          genreList.add(genre);
        });
      });
      setGenres([...genreList]);
    }
  }, [data, selectedGenre]);

  if (!show) return null;
  if (loading) return <div>Loading...</div>;
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
          {data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre, index) => (
          <button key={index} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
