import { tryLogin } from '../auth';
import { formatErrors } from '../globals';

export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),

        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        authenticateUser: (parent, { email, password }, { models, SECRET, SECRET2 }) => {
            try {
                tryLogin(email, password, models, SECRET, SECRET2);
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