export default `
    type Team {
        id: Int!
        name: String!
        directMessageMembers: [User!]
        channels: [Channel!]!
        admin: Boolean!
    }

    type Query {
        allTeams: [Team!]!
        inviteTeams: [Team!]!
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): VoidResponse!
    }

    type CreateTeamResponse {
        success: Boolean!
        team: Team
        errors: [Error!]
    }
`;