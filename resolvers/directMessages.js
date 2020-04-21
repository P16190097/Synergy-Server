import { withFilter } from 'apollo-server-express';
import pubSub from '../pubsub';
import { formatErrors } from '../globals';
import { requiresAuth, directMessageAuth } from '../permissions';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

export default {
    Query: {
        getDirectMessages: requiresAuth.createResolver(async (parent, args, { models, user }) => models.DirectMessage.findAll({
            where: {
                [Op.or]: [
                    { [Op.and]: [{ receiverId: args.receiverId }, { senderId: user.id }] },
                    { [Op.and]: [{ receiverId: user.id }, { senderId: args.receiverId }] },
                ],
                teamId: args.teamId,
            },
            order: [['createdAt', 'ASC']]
        }, { raw: true }
        )),
    },
    Mutation: {
        createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const message = await models.DirectMessage.create({ teamId: args.teamId, receiverId: args.receiverId, senderId: user.id, text: args.text });

                pubSub.publish(NEW_DIRECT_MESSAGE, {
                    teamId: args.teamId,
                    senderId: user.id,
                    receiverId: args.receiverId,
                    newDirectMessage: {
                        ...message.dataValues,
                        sender: {
                            username: user.username
                        }
                    },
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
        }),
        deleteDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                await models.DirectMessage.destroy({ where: { id: args.messageId, senderId: user.id } });
                return {
                    success: true,
                };
            }
            catch (error) {
                return {
                    success: false,
                    errors: formatErrors(error, models)
                };
            }
        }),
    },
    Subscription: {
        newDirectMessage: {
            subscribe: directMessageAuth.createResolver(withFilter(
                () => pubSub.asyncIterator(NEW_DIRECT_MESSAGE),
                (payload, args, { user }) => payload.teamId === args.teamId &&
                    ((payload.senderId === user.id && payload.receiverId === args.receiverId) ||
                        (payload.senderId === args.receiverId && payload.receiverId === user.id))),
            ),
        },
    },
    DirectMessage: {
        sender: ({ sender, senderId }, args, { models }) => {
            if (sender) {
                return sender;
            }
            return models.User.findOne({ where: { id: senderId } }, { raw: true });
        },
    },
};