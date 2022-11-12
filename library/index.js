import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './typeDefs.js';
import * as services from './services.js';

const MONGODB_URI = 'mongodb://localhost:27017/osa8';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((error) => {
    console.log('error:', error.message);
  });

const resolvers = {
  Query: {
    bookCount: async () => services.countBooks(),
    authorCount: async () => services.countAuthors(),
    allBooks: async (_root, args) => services.getBooks(args),
    allAuthors: async () => services.getAuthors(),
  },
  Mutation: {
    addBook: async (_root, args) => services.createBook(args),
    editAuthor: async (_root, args) => services.editAuthor(args),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
