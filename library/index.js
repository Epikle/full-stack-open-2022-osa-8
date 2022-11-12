import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';
import jwt from 'jsonwebtoken';

import User from './models/user.js';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
import { JWT_SECRET } from './services.js';

const MONGODB_URI = 'mongodb://localhost:27017/osa8';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((error) => {
    console.log('error:', error.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
