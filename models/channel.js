export default (sequalize, DataTypes) => {
    const Channel = sequalize.define('channel', {
        name: DataTypes.STRING,
        public: DataTypes.BOOLEAN
    });
    
    Channel.associate = (models) => {
        // 1:M
        Channel.belongsTo(models.Team, {
            foreignKey: 'teamId'
        });
    };

    return Channel;
};