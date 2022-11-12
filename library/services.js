import { UserInputError } from 'apollo-server';

import Author from './models/author.js';
import Book from './models/book.js';

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

export const createBook = async (args) => {
  const author = await Author.findOne({ name: args.author });
  const newAuthor = new Author({ name: args.author });

  if (!author) {
    try {
      await newAuthor.save();
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

export const editAuthor = async (args) => {
  const author = await Author.findOneAndUpdate(
    { name: args.name },
    { born: args.setBornTo },
    { new: true }
  );

  if (!author) return null;
  return author;
};
