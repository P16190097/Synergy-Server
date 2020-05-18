import bcrypt from 'bcrypt';
import { saltRounds } from '../globals';

export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: {
                    args: true,
                    msg: 'Username may only contain letters and numbers',
                },
                len: {
                    args: [3, 25],
                    msg: 'Username must be between 3 and 25 characters long',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Invalid email',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [5, 100],
                    msg: 'Password must be between 5 and 100 characters long',
                },
            },
        },
    },
        {
            hooks: {
                afterValidate: async (user) => {
                    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                    // eslint-disable-next-line require-atomic-updates
                    user.password = hashedPassword;
                },
            },
        },
    );

    User.associate = (models) => {
        User.belongsToMany(models.Team, {
            through: 'member',
            foreignKey: {
                name: 'userId',
                field: 'user_id'
            }
        });
    };

    return User;
};