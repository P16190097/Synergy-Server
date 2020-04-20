import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

export default {
    Query: {
        getUserTeams: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            const teams = models.Team.findAll({
                include: [
                    {
                        model: models.User,
                        where: { id: user.id },
                    }
                ]
            });
            return teams;
        }),
        getTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            const adminUser = await models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } }, { raw: true });
            if (!adminUser || !adminUser.admin) {
                throw new Error('You cannot edit this team');
            }
            return models.Team.findOne({ where: { id: args.teamId } });
        })
    },
    Mutation: {
        createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                // tries to create team and initial channel then if either fails it dosent create either the channel or the team
                const response = await models.sequelize.transaction(
                    async () => {
                        const team = await models.Team.create({ ...args, owner: user.id });
                        await models.Channel.create({ name: 'general', public: true, teamId: team.id });
                        await models.Member.create({ teamId: team.id, userId: user.id, admin: true });
                        return team;
                    }
                );
                return {
                    success: true,
                    team: response,
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
        editTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            const auth = await models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } }, { raw: true });
            if (!auth.dataValues.admin) {
                return {
                    success: false,
                    errors: [{ path: 'email', message: 'You cannot edit this team' }],
                };
            }

            try {
                await models.Team.update({ name: args.teamName, description: args.description }, { where: { id: args.teamId } });
            }
            catch (error) {
                console.log(error);
                return {
                    success: false,
                    errors: formatErrors(error, models),
                };
            }

            return {
                success: true,
            };
        }),
        deleteTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const auth = await models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } }, { raw: true });
                if (auth.dataValues.admin) {
                    console.log('deleting team...');
                    await models.Team.destroy({ where: { id: args.teamId } });
                    return {
                        success: true,
                    };
                }
                return {
                    success: false,
                    erorrs: [{ path: 'Delete Team', message: 'Not authorized to delete this team' }],
                };
            }
            catch (error) {
                return {
                    success: false,
                    errors: formatErrors(error, models),
                };
            }
        }),
        addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
            try {
                const memberPromise = models.Member.findOne({ where: { teamId, userId: user.id } }, { raw: true });
                const userToAddPromise = models.User.findOne({ where: { email }, raw: true });
                const [member, userToAdd] = await Promise.all([memberPromise, userToAddPromise]);
                if (!member.admin) {
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
                    user: userToAdd,
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
        leaveTeam: requiresAuth.createResolver(async (parent, { teamId }, { models, user }) => {
            try {
                const auth = await models.User.findOne({ where: { id: user.id } });
                if (!auth.dataValues.admin) {
                    await models.Member.destroy({ where: { userId: user.id, teamId } });
                    return {
                        success: true,
                    };
                }
                return {
                    success: false,
                    errors: [{ path: 'leaveTeam', message: 'Admins may not leave teams' }],
                };
            }
            catch (error) {
                return {
                    success: false,
                    errors: formatErrors(models, error),
                };
            }
        }),
    },
    Team: {
        channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
        directMessageMembers: ({ id }, args, { models, user }) =>
            models.sequelize.query('SELECT DISTINCT users.id, users.username FROM users JOIN direct_messages AS dms ON (users.id = dms.sender_id) OR (users.id = dms.receiver_id) WHERE (:currentUserId = dms.receiver_id OR :currentUserId = dms.sender_id) AND dms.team_id = :teamId',
                {
                    replacements: {
                        currentUserId: user.id,
                        teamId: id,
                    },
                    model: models.User,
                    raw: true,
                }
            ),
        admin: async ({ id }, args, { models, user }) => {
            const admin = await models.Member.findOne({ attributes: ['admin'], where: { userId: user.id, teamId: id } });
            return admin.dataValues.admin;
        },
    },
};