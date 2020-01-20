import { _ } from 'lodash';
import { tryLogin } from '../auth';

const formatErrors = (e, models) => {
    if (e instanceof models.Sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ['path', 'message']));
    }
    return [{ path: 'name', message: 'something went wrong' }];
};

export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),

        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        authenticateUser: (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
        registerUser: async (parent, { ...otherArgs }, { models }) => {
            try {
                const user = await models.User.create({ ...otherArgs });
                return {
                    ok: true,
                    user,
                };
            }
            catch (error) {
                return {
                    ok: false,
                    errors: formatErrors(error, models),
                };
            }
            // store hashed password, 12 saltrounds should suffice
            // models.User.create(args);
        },
    }
}; 