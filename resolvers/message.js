import { withFilter, PubSub } from 'apollo-server-express';
import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

const pubSub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
    Query: {
        getMessages: requiresAuth.createResolver(async (parent, args, { models }) => models.Message.findAll({ where: { channelId: args.channelId }, order: [['createdAt', 'ASC']] }, { raw: true })),
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const message = await models.Message.create({ ...args, userId: user.id });

                pubSub.publish(NEW_CHANNEL_MESSAGE, {
                    channelId: args.channelId,
                    newChannelMessage: message.dataValues,
                });

                return {
                    success: true,
                };
            }
            catch (error) {
                console.log(error);
                return {
                    success: false,
                    errors: formatErrors(error, models),
                };
            }
        })
    },
    Subscription: {
        newChannelMessage: {
            subscribe: withFilter(
                (parent, args, { models, user }) =>
                    // function here needs to be asynchronous
                    // const channel = await models.Channel.findOne({ where: { channelId: channel.id } });
                    // const member = await models.Member.findOne({ where: { teamId: channel.teamId, userId: user.id } });
                    // if (!member) {
                    //     throw new Error('You\'re not a member of this team');
                    // }
                    pubSub.asyncIterator(NEW_CHANNEL_MESSAGE)
                ,
                (payload, args) => {
                    return payload.channelId === args.channelId;
                }
            )
        },
    },
    Message: {
        user: ({ user, userId }, args, { models }) => {
            if (user) {
                return user;
            }
            return models.User.findOne({ where: { id: userId } }, { raw: true });
        },
    },
};