import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { CREATE_BOOK, GET_AUTHORS, GET_BOOKS } from '../queries';

const initialQueriesToReset = [
  { query: GET_AUTHORS },
  { query: GET_BOOKS, variables: { selectedGenre: null } },
];

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [queries, setQueries] = useState(initialQueriesToReset);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: queries,
    onError: (error) => {
      console.error(error);
    },
    onCompleted: () => {
      setQueries(initialQueriesToReset);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    await createBook({
      variables: { title, author, published: +published, genres },
    });

    const resetQueries = genres.map((genre) => ({
      query: GET_BOOKS,
      variables: {
        selectedGenre: genre,
      },
    }));

    setQueries((prevS) => prevS.concat(...resetQueries));

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
