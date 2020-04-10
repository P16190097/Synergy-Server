export default (sequalize, DataTypes) => {
    const directMessage = sequalize.define('direct_message', {
        text: DataTypes.STRING
    });

    directMessage.associate = (models) => {
        // 1:M
        directMessage.belongsTo(models.User, {
            foreignKey: {
                name: 'receiverId',
                field: 'receiver_id',
            }
        });

        // 1:M
        directMessage.belongsTo(models.Team, {
            foreignKey: {
                name: 'teamId',
                field: 'team_id',
            }
        });

        // 1:M
        directMessage.belongsTo(models.User, {
            foreignKey: {
                name: 'senderId',
                field: 'sender_id',
            },
        });
    };

    return directMessage;
};