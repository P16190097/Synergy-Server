import { _ } from 'lodash';

export const saltRounds = 12;

export const formatErrors = (e, models) => {
    if (e instanceof models.Sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ['path', 'message']));
    }
    return [{ path: 'name', message: 'something went wrong' }];
};
