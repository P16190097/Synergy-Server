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
        getUserTeams: [Team!]!
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): UserResponse!
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