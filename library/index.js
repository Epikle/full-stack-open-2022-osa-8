import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';

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
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
