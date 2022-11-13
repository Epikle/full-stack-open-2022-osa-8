import { PubSub } from 'graphql-subscriptions';

import * as services from './services.js';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    bookCount: async () => services.countBooks(),
    authorCount: async () => services.countAuthors(),
    allBooks: async (_root, args) => services.getBooks(args),
    allAuthors: async () => services.getAuthors(),
    me: (_root, _args, context) => context.currentUser,
  },
  //old author bookcount
  // Author: {
  //   bookCount: async (root) => services.countBooks(root.id),
  // },
  Mutation: {
    addBook: async (_root, args, context) => {
      const book = services.createBook(args, context);
      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },
    editAuthor: async (_root, args, context) =>
      services.editAuthor(args, context),
    createUser: async (_root, args) => services.createUser(args),
    login: async (_root, args) => services.loginUser(args),
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};
