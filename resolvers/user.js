import { tryLogin } from '../auth';
import { formatErrors } from '../globals';
import { requiresAuth } from '../permissions';

export default {
    User: {
        teams: (parent, args, { models, user }) =>
            models.sequelize.query(
                'SELECT * FROM teams INNER JOIN members ON id = team_id WHERE user_id = ?',
                {
                    replacements: [user.id],
                    model: models.Team,
                    raw: true,
                },
            ),
    },
    Query: {
        getUser: requiresAuth.createResolver((parent, args, { models, user }) => models.User.findOne({ where: { id: user.id } })),

        allUsers: (parent, args, { models }) => models.User.findAll(),

        allTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
            models.Team.findAll({ where: { owner: user.id } }, { raw: true })
        ),

        // 'include' defines the join between teams and user table
        inviteTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
            models.Team.findAll({
                include: [
                    {
                        model: models.User,
                        where: { id: user.id }
                    }
                ]
            }, { raw: true })
        ),
        // This runs custom sql commands where sequalize does not have the capability to do so
        // inviteTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
        //     models.sequelize.query('SELECT * FROM teams INNER JOIN members ON id = team_id WHERE user_id = ?', {
        //         replacements: [user.id],
        //         models: models.Team,
        //     }),
        // ),
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
    }
}; 