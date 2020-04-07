export default (sequalize, DataTypes) => {
    const Member = sequalize.define('member', {
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });

    return Member;
};