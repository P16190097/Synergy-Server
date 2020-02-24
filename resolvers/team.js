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
        addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
            try {
                const teamPromise = models.Team.findOne({ where: { id: teamId } }, { raw: true });
                const userToAddPromise = models.User.findOne({ where: { email }, raw: true });
                const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise]);
                if (team.owner !== user.id) {
                    return {
                        success: false,
                        errors: [{ path: 'email', message: 'You cannot add members to this team' }]
                    };
                }
                if (user.id === userToAdd.id) {
                    return {
                        success: false,
                        errors: [{ path: 'email', message: 'You cannot add this user to this team' }]
                    };
                }
                if (!userToAdd) {
                    return {
                        success: false,
                        errors: [{ path: 'email', message: 'Could not find user with this email' }]
                    };
                }
                await models.Member.create({ userId: userToAdd.id, teamId });
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
        channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
    },
};