import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const createResolver = (resolver) => {
    const baseResolver = resolver;
    baseResolver.createResolver = (childResolver) => {
        const newResolver = async (parent, args, context, info) => {
            await resolver(parent, args, context, info);
            return childResolver(parent, args, context, info);
        };
        return createResolver(newResolver);
    };
    return baseResolver;
};

export const requiresAuth = createResolver((parent, args, context) => {
    if (!context.user || !context.user.id) {
        throw new Error('Not Authenticated');
    }
});

export const requiresAdmin = requiresAuth.createResolver((parent, args, context) => {
    if (!context.user.isAdmin) {
        throw new Error('Requires admin access');
    }
});

export const directMessageAuth = createResolver(async (parent, args, { user, models }) => {
    if (!user || !user.id) {
        throw new Error('Not authenticated');
    }

    const members = await models.Member.findAll({
        where: {
            teamId: args.teamId,
            [Op.or]: [{ userId: args.receiverId }, { userId: user.id }],
        },
    });

    if (members.length !== 2) {
        throw new Error('Something went wrong');
    }
});

export const requiresMembership = createResolver(async (parent, args, { models, user }) => {
    if (!user || !user.id) {
        throw new Error('Not Authenticated');
    }
    const channel = await models.Channel.findOne({ where: { id: args.channelId } });
    const member = await models.Member.findOne({ where: { teamId: channel.teamId, userId: user.id } });
    if (!member) {
        throw new Error('You\'re not a member of this team');
    }
});
