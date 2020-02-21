import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

export default {
    Query: {
        allTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
            models.Team.findAll({ where: { owner: user.id } }, { raw: true })
        )
    },
    Mutation: {
        createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                await models.Team.create({ ...args, owner: user.id });
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
    },
    Team: {
        channels: ({ id }, args, { models }) => models.Channel.findAll({ teamId: id }),
    },
};