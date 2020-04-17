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
            },
            onDelete: 'CASCADE',
            hooks: true,
        });

        // 1:M
        directMessage.belongsTo(models.Team, {
            foreignKey: {
                name: 'teamId',
                field: 'team_id',
            },
            onDelete: 'CASCADE',
            hooks: true,
        });

        // 1:M
        directMessage.belongsTo(models.User, {
            foreignKey: {
                name: 'senderId',
                field: 'sender_id',
            },
            onDelete: 'CASCADE',
            hooks: true,
        });
    };

    return directMessage;
};