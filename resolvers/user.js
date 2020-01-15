import bcrypt from 'bcrypt';
import { saltRounds } from '../globals';
//import { _ } from 'lodash';
import { UserInputError } from 'apollo-server-express';

// const formatErrors = (e, models) => {
//     if (e instanceof models.sequalize.ValidationError) {
//         return e.errors.map(x => _.pick(x, ['path', 'message']));
//     }
//     return [{ path: 'name', message: 'something went wrong' }];
// };

export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),

        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        registerUser: async (parent, { password, ...otherArgs }, { models }) => {
            try {
                if (password.length < 5 || password.length > 100) {
                    throw new UserInputError('Error: Something went wrong');
                    // return {
                    //     ok: false,
                    //     errors: [
                    //         {
                    //             path: 'password',
                    //             message: 'Password must be between 5 and 100 characters long',
                    //         },
                    //     ]
                    // };
                }

                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const user = await models.User.create({ ...otherArgs, password: hashedPassword });

                return {
                    ok: true,
                    user: user,
                };
            }
            catch (error) {
                console.log(error);
                throw new UserInputError('Error: Something went wrong');
                // return {
                //     ok: false,
                //     errors: formatErrors(error, models),
                // };
            }
            // store hashed password, 12 saltrounds should suffice
            // models.User.create(args);
        },
    }
}; 