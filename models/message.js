export default (sequalize, DataTypes) => {
    const Message = sequalize.define('message', {
        text: DataTypes.STRING
    });
    
    Message.associate = (models) => {
        // 1:M
        Message.belongsTo(models.Channel, {
            foreignKey: 'channelId'
        });

        // 1:M
        Message.belongsTo(models.User, {
            foreignKey: 'owner'
        });
    };

    return Message;
};