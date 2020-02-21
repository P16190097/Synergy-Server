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
    }

    type CreateTeamResponse {
        success: Boolean!
        team: Team!
        errors: [Error!]
    }
`;