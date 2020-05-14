import { tryLogin } from '../auth';
import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

export default {
    Query: {
        getUser: requiresAuth.createResolver((parent, args, { models, user }) => models.User.findOne({ where: { id: user.id } })),

        getSingleUser: requiresAuth.createResolver((parent, args, { models }) => models.User.findOne({ where: { id: args.userId } })),

        getTeamUsers: requiresAuth.createResolver((parent, args, { models }) => models.User.findAll({
            include: [
                {
                    model: models.Team,
                    where: { id: args.teamId }
                }
            ]
        })),
    },
    Mutation: {
        authenticateUser: (parent, { email, password }, { models, SECRET, SECRET2 }) => {
            try {
                const response = tryLogin(email, password, models, SECRET, SECRET2);
                return response;
            }
            catch (error) {
                return {
                    success: false,
                    errors: [{ path: 'authenticate', message: 'Could not authenticate user. Please try again later' }]
                };
            }
        },
        registerUser: async (parent, { ...otherArgs }, { models }) => {
            try {
                const user = await models.User.create({ ...otherArgs });
                return {
                    success: true,
                    user,
                };
            }
            catch (error) {
                return {
                    success: false,
                    errors: formatErrors(error, models),
                };
            }
            // store hashed password, 12 saltrounds should suffice
            // models.User.create(args);
        },
        deleteUser: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                await models.User.destroy({ where: { id: user.id } });
                return {
                    success: true,
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
    User: {
        teams: (parent, args, { models, user }) =>
            models.sequelize.query(
                'SELECT * FROM teams INNER JOIN members ON teams.id = members.team_id WHERE members.user_id = ?',
                {
                    replacements: [user.id],
                    model: models.Team,
                    raw: true,
                },
            ),
    },
}; 