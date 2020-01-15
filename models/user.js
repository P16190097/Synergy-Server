export default (sequalize, DataTypes) => {
    const User = sequalize.define('user', {
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
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Invalid email',
                },
            }
        },
        password: {
            type: DataTypes.STRING,
        },
    });

    User.associate = (models) => {
        User.belongsToMany(models.Team, {
            through: 'member',
            foreignKey: {
                name: 'userId',
                field: 'user_id'
            }
        });
        // N:M
        User.belongsToMany(models.Channel, {
            through: 'channel_member',
            foreignKey: {
                name: 'userId',
                field: 'user_id'
            }
        });
    };

    return User;
};