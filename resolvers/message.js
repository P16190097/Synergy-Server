import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

export default {
    Query: {
        getMessages: requiresAuth.createResolver(async (parent, args, { models }) => models.Message.findAll({ where: { channelId: args.channelId }, order: [['createdAt', 'ASC']] }, { raw: true })),
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                await models.Message.create({ ...args, userId: user.id });
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
    Message: {
        user: ({ userId }, args, { models }) => models.User.findOne({ where: { id: userId } }, { raw: true }),
    },
};