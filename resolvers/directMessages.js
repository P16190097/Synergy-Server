import { withFilter, PubSub } from 'apollo-server-express';
import { formatErrors } from '../globals';
import { requiresAuth, requiresMembership } from '../permissions';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const pubSub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
    Query: {
        getDirectMessages: async (parent, args, { models, user }) => models.DirectMessage.findAll({
            where: {
                [Op.or]: [
                    { [Op.and]: [{ receiverId: args.receiverId }, { senderId: user.id }] },
                    { [Op.and]: [{ receiverId: user.id }, { senderId: args.receiverId }] },
                ],
                teamId: args.teamId,
            },
            order: [['createdAt', 'ASC']]
        }, { raw: true }
        ),
    },
    Mutation: {
        createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                await models.DirectMessage.create({ teamId: args.teamId, receiverId: args.receiverId, senderId: user.id, text: args.text });

                // pubSub.publish(NEW_CHANNEL_MESSAGE, {
                //     channelId: args.channelId,
                //     newChannelMessage: message.dataValues,
                // });

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
    // Subscription: {
    //     newChannelMessage: {
    //         subscribe: requiresMembership.createResolver(withFilter(
    //             () => pubSub.asyncIterator(NEW_CHANNEL_MESSAGE),
    //             (payload, args) => {
    //                 return payload.channelId === args.channelId;
    //             }
    //         )),
    //     },
    // },
    DirectMessage: {
        sender: ({ sender, senderId }, args, { models }) => {
            if (sender) {
                return sender;
            }
            return models.User.findOne({ where: { id: senderId } }, { raw: true });
        },
    },
};