export default (sequalize, DataTypes) => {
    const Team = sequalize.define('team', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
        },
    });

    Team.associate = (models) => {
        Team.belongsToMany(models.User, {
            through: models.Member,
            foreignKey: {
                name: 'teamId',
                field: 'team_id'
            }
        });
    };

    return Team;
};