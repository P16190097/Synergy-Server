import bcrypt from 'bcrypt';
import { _ } from 'lodash';
import jwt from 'jsonwebtoken';

export const createTokens = async (user, secret, secret2) => {
    const createToken = jwt.sign(
        {
            user: _.pick(user, ['id']),
        },
        secret,
        {
            expiresIn: '1h',
        },
    );

    const createRefreshToken = jwt.sign(
        {
            user: _.pick(user, 'id'),
        },
        secret2,
        {
            expiresIn: '7d',
        },
    );

    return [createToken, createRefreshToken];
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
    const user = await models.User.findOne({ where: { email }, raw: true });
    if (!user) {
        return {
            success: false,
            errors: [{ path: 'login', message: 'Invalid login' }],
        };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return {
            success: false,
            errors: [{ path: 'login', message: 'Invalid login' }]
        };
    }

    const refreshTokenSecret = user.password + SECRET2;

    const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

    return {
        success: true,
        token,
        refreshToken,
    };
};
