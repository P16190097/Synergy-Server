export default `
    type Message {
        id: Int!
        text: String!
        user: User!
        createdAt: String!
    }

    type MessageResponse {
        success: Boolean!
        messages: [Message!]
        errors: [Error!]
    }

    type Query {
        getMessages(channelId: Int!): [Message!]!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String!): VoidResponse!
        deleteMessage(teamId: Int!, messageId: Int!): VoidResponse!
    }

    type Subscription {
        newChannelMessage(channelId: Int!): Message!
    }
`;