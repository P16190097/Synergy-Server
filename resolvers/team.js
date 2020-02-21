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
                const team = await models.Team.create({ ...args, owner: user.id });
                await models.Channel.create({ name: 'general', public: true, teamId: team.id });
                return {
                    success: true,
                    team: team,
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
        channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
    },
};