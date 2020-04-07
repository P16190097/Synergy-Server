export default `
    type DirectMessage {
        id: Int!
        text: String!
        senderId: Int!
        receiverId: Int!
    }

    type Query {
        directMessages: [Message!]!
    }

    type Mutation {
        createDirectMessage(receiverId: Int!, text: String!): Boolean!
    }
`;
