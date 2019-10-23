export default (sequalize, DataTypes) => {
    const Team = sequalize.define('team', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    });

    Team.associate = (models) => {
        Team.belongsToMany(models.User, {
            through: 'member',
            foreignKey: {
                name: 'teamId',
                field: 'team_id'
            }
        });
        Team.belongsTo(models.User, {
            foreignKey: 'owner'
        });
    };

    return Team;
};