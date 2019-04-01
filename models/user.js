export default (sequalize, DataTypes) => {
    const User = sequalize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
    });
    User.associate = (models) => {
        User.belongsToMany(models.Team, {
            through: 'member',
            foreignKey: 'userId'
        })
    };

    return User;
};