import express from 'express';
import models from './models';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { refreshTokens } from './auth';

/* global __dirname */
// __dirname conains the absolute path of the directory containing the currently executing file
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// JWT Secret token and refresh token keys
const SECRET = 'aksdgaygfjscnaoihwq';
const SECRET2 = 'ashfdskdbgalkdfjgoahwd';

// const graphqlEndpoint = '/graphql';

const app = express();
const port = 8080;

const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            Request.user = user;
        }
        catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
            // eslint-disable-next-line require-atomic-updates
            req.user = newTokens.user;
        }
    }
    next();
};

app.use(addUser);
app.use(cors('*'));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: async (connectionParams /*, webSocket*/) => {
            if (connectionParams.token && connectionParams.refreshToken) {
                let user = null;
                const { token, refreshToken } = connectionParams;
                try {
                    const payload = jwt.verify(token, SECRET);
                    user = payload.user;
                }
                catch (err) {
                    const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
                    // eslint-disable-next-line require-atomic-updates
                    user = newTokens.user;
                }
                if (!user) {
                    throw new Error('Invalid auth tokens!');
                }

                const member = await models.Member.findOne({ where: { teamId: 1, userId: user.id } });

                if (!member) {
                    throw new Error('Not authorised to view this team!');
                }

                return true;
            }
            throw new Error('Missing auth token!');
        },
    },
    context: ({ req, connection }) => ({
        models,
        user: connection ? connection.user : req.user,
        SECRET,
        SECRET2
    })
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

//to drop tables and reload
// models.sequelize.sync({ force: true }).then(() => {
//     app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`));
// });

models.sequelize.sync().then(() => {
    httpServer.listen({ port }, () => {
        console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
    });
});