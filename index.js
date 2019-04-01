import express from 'express';
import typeDefs from './schema';
import resolvers from './resolvers';
import { ApolloServer, gql } from 'apollo-server-express';
import models from './models';

// export const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers
// });

const app = express();
const port = 8080;

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// app.use('/graphql', bodyparser.json(), graphqlExpress({ schema }));
// app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }))

//app.listen(8080);
models.sequelize.sync({}).then(x => {
    app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`))
});