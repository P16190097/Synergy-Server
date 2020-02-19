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

export const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
    let userId = 0;
    try {
        const { user: { id } } = jwt.decode(refreshToken);
        userId = id;
    }
    catch (error) {
        return {};
    }

    if (!userId) {
        return {};
    }

    const user = await models.User.findOne({ where: { id: userId }, raw: true });

    if (!user) {
        return {};
    }

    const refreshSecret = user.password + SECRET2;

    try {
        jwt.verify(refreshToken, refreshSecret);
    }
    catch (error) {
        console.log('verification error');
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
    const user = await models.User.findOne({ where: { email }, raw: true });
    if (!user) {
        return {
            success: false,
            errors: [{ path: 'authenticateUser', message: 'Invalid login' }]
        };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return {
            success: false,
            errors: [{ path: 'authenticateUser', message: 'Invalid login' }]
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
