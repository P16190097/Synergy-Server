export default (sequalize, DataTypes) => {
    const Message = sequalize.define('message', {
        text: DataTypes.STRING
    });

    Message.associate = (models) => {
        // 1:M
        Message.belongsTo(models.Channel, {
            foreignKey: {
                name: 'channelId',
                field: 'channel_id'
            },
            onDelete: 'CASCADE',
            hooks: true,
        });

        // 1:M
        Message.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                field: 'user_id'
            },
            onDelete: 'CASCADE',
            hooks: true,
        });
    };

    return Message;
};