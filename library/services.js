import { AuthenticationError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';

import Author from './models/author.js';
import Book from './models/book.js';
import User from './models/user.js';

export const JWT_SECRET = 'TOSI_SALAINEN_2022';

export const countBooks = async (id) => {
  const query = id ? { author: id } : {};

  return Book.find(query).countDocuments();
};

export const countAuthors = async () => Author.collection.countDocuments();

export const getAuthors = async () => Author.find({});

export const getBooks = async ({ author, genre }) => {
  if (author && genre) {
    const findAuthor = await Author.findOne({ name: author });
    if (!findAuthor) return null;
    return Book.find({ author: findAuthor.id, genres: genre }).populate(
      'author'
    );
  }
  if (author) {
    const findAuthor = await Author.findOne({ name: author });
    if (!findAuthor) return null;
    return Book.find({ author: findAuthor.id }).populate('author');
  }
  if (genre) {
    return Book.find({ genres: genre }).populate('author');
  }

  return Book.find({}).populate('author');
};

export const createBook = async (args, context) => {
  const { currentUser } = context;
  if (!currentUser) throw new AuthenticationError('not authenticated');

  let author = await Author.findOne({ name: args.author });

  if (!author) {
    try {
      const newAuthor = new Author({ name: args.author });
      author = await newAuthor.save();
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      });
    }
  }

  const book = new Book({ ...args, author: author.id });

  try {
    await book.save();
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  }

  return book;
};

export const editAuthor = async (args, context) => {
  const { currentUser } = context;
  if (!currentUser) throw new AuthenticationError('not authenticated');

  const author = await Author.findOneAndUpdate(
    { name: args.name },
    { born: args.setBornTo },
    { new: true }
  );

  if (!author) return null;
  return author;
};

export const createUser = async (args) => {
  const user = new User({ ...args });
  try {
    await user.save();
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  }

  return user;
};

export const loginUser = async (args) => {
  const user = await User.findOne({ username: args.username });

  if (!user || args.password !== 'salasana') {
    throw new UserInputError('wrong credentials!');
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  return { value: jwt.sign(userForToken, JWT_SECRET) };
};
