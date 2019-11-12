import express from 'express';
import models from './models';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { ApolloServer } from 'apollo-server-express';

/* global __dirname */
// __dirname conains the absolute path of the directory containing the currently executing file
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// const graphqlEndpoint = '/graphql';

const app = express();
const port = 8080;

const server = new ApolloServer({ typeDefs, resolvers, context: { models, user: { id: 1 } } });
server.applyMiddleware({ app });


//to drop tables and reload
// models.sequelize.sync({ force: true }).then(() => {
//     app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`));
// });

models.sequelize.sync().then(() => {
    app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`));
});