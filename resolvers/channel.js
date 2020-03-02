import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';
import user from '../schema/user';

export default {
    Mutation: {
        createChannel: requiresAuth.createResolver(async (parent, args, { models }) => {
            try {
                const team = await models.Team.findOne({ where: { id: args.teamId } }, { raw: true });
                if (team.owner !== user.id) {
                    return {
                        success: false,
                        errors: [{ path: 'channel', message: 'You do not have permission to create channels here' }]
                    };
                }
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