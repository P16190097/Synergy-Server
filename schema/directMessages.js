export default `
    type DirectMessage {
        id: Int!
        text: String!
        sender: User!
        receiverId: Int!
        createdAt: String!
    }

    type Query {
        getDirectMessages(teamId: Int!, receiverId: Int!): [DirectMessage!]!
    }

    type Mutation {
        createDirectMessage(teamId: Int!, receiverId: Int!, text: String!): VoidResponse!
    }
`;
