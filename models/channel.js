export default (sequalize, DataTypes) => {
    const Channel = sequalize.define('channel', {
        name: DataTypes.STRING,
        public: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    });

    Channel.associate = (models) => {
        // 1:M
        Channel.belongsTo(models.Team, {
            foreignKey: 'teamId',
            field: 'team_id',
            onDelete: 'CASCADE',
            hooks: true,
        });
    };

    return Channel;
};