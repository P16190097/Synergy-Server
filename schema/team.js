export default `
    type Team {
        id: Int!
        name: String!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type Query {
        allTeams: [Team!]!
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): VoidResponse!
    }

    type CreateTeamResponse {
        success: Boolean!
        team: Team!
        errors: [Error!]
    }

    type VoidResponse {
        success: Boolean!
        errors: [Error!]
    }
`;