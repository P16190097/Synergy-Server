import { formatErrors } from '../globals';

export default {
    Mutation: {
        createTeam: async (parent, args, { models, user }) => {
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
        },
    }
};