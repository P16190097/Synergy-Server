export default `
    type Channel {
        id: Int!
        name: String!
        public: Boolean!
        messages: [Message!]!
        users: [User!]!
    }

    type Mutation {
        createChannel(teamId: Int!, name: String!, public: Boolean=false): ChannelResponse! 
        deleteChannel(channelId: Int!, teamId: Int!): VoidResponse!
    }

    type ChannelResponse {
        success: Boolean!
        channel: Channel
        errors: [Error!]
    }
`;