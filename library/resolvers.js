import * as services from './services.js';

export const resolvers = {
  Query: {
    bookCount: async () => services.countBooks(),
    authorCount: async () => services.countAuthors(),
    allBooks: async (_root, args) => services.getBooks(args),
    allAuthors: async () => services.getAuthors(),
    me: (_root, _args, context) => context.currentUser,
  },
  Author: {
    bookCount: async (root) => services.countBooks(root.id),
  },
  Mutation: {
    addBook: async (_root, args) => services.createBook(args),
    editAuthor: async (_root, args) => services.editAuthor(args),
  },
};
