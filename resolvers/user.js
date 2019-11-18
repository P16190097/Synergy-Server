import bcrypt from 'bcrypt';
import { saltRounds } from '../globals';

export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),

        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        registerUser: async (parent, { password, ...otherArgs }, { models }) => {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            try {
                await models.User.create({ ...otherArgs, password: hashedPassword });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
            // store hashed password, 12 saltrounds should suffice
            // models.User.create(args);
        },
    }
}; 