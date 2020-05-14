import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

export default {
    Mutation: {
        createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const member = await models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } });
                //const team = await models.Team.findOne({ where: { id: args.teamId } }, { raw: true });
                if (!member.admin) {
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
        }),
        deleteChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const member = await models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } });
                if (!member.admin) {
                    return {
                        success: false,
                        errors: [{ path: 'channel', message: 'You do not have permission to create channels here' }]
                    };
                }
                await models.Channel.destroy({ where: { id: args.channelId } });
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
    }
};