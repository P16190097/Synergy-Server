import express from 'express';
import models from './models';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// export const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers
// });

// const graphqlEndpoint = '/graphql';

const app = express();
const port = 8080;

const server = new ApolloServer({ typeDefs, resolvers, context: { models } });
server.applyMiddleware({ app });

// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context: models }));
// app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }))
// app.listen(8080);


//to drop tables and reload
// models.sequelize.sync({force: true}).then(x => {
//     app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`))
// });

models.sequelize.sync().then(x => {
    app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`))
});