export default `
    type Team {
        id: Int!
        name: String!
        description: String!
        directMessageMembers: [User!]
        channels: [Channel!]!
        admin: Boolean!
    }

    type Query {
        allTeams: [Team!]!
        getUserTeams: [Team!]!
        getTeam(teamId: Int!): Team!
    }

    type Mutation {
        createTeam(name: String!, description: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): UserResponse!
        editTeam(teamId: Int!, teamName: String!, description: String!): VoidResponse!
    }

    type CreateTeamResponse {
        success: Boolean!
        team: Team
        errors: [Error!]
    }

    type UserResponse {
        success: Boolean!
        user: User
        errors: [Error!]
    }
`;