import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

export default {
    Mutation: {
        createChannel: requiresAuth.createResolver(async (parent, args, { models }) => {
            try {
                const channel = await models.Channel.create(args);
                return {
                    success: true,
                    channel: channel,
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
    }
};