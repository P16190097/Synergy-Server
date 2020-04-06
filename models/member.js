export default (sequalize) => {
    const Channel = sequalize.define('member', {});

    return Channel;
};