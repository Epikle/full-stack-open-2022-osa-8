import { gql } from '@apollo/client';

export const GET_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const GET_BOOKS = gql`
  query AllBooks($selectedGenre: String) {
    allBooks(genre: $selectedGenre) {
      id
      author {
        name
      }
      published
      title
      genres
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      id
      genres
    }
  }
`;

export const EDIT_BORN = gql`
  mutation editBorn($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      username
      favoriteGenre
      id
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      id
      genres
    }
  }
`;
