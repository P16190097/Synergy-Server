export default (sequalize, DataTypes) => {
    const Channel = sequalize.define('member', {
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });

    return Channel;
};