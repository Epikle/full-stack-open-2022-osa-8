import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

import { GET_AUTHORS, EDIT_BORN } from '../queries';

const Authors = ({ show, token }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const result = useQuery(GET_AUTHORS);

  const [editBorn] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onError: (error) => {
      console.error(error);
    },
  });

  const submitHandler = async (event) => {
    event.preventDefault();

    await editBorn({
      variables: { name, born: +born },
    });
    setName('');
    setBorn('');
  };

  if (!show) return null;
  if (result.loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <>
          <h2>set birthyear</h2>
          <form onSubmit={submitHandler}>
            <label htmlFor="name">name</label>
            <select
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
            >
              <option value="">select name</option>
              {result.data.allAuthors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="born">born</label>
            <input
              id="born"
              type="number"
              value={born}
              onChange={(e) => setBorn(e.target.value)}
            />
            <br />
            <button>update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
