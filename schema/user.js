export default `
    type User {
        id: Int!
        username: String!
        email: String!
        teams: [Team!]!
    }

    type Query {
        getUser: User!
        allUsers: [User!]!
        getSingleUser(userId: Int!): User!
        getTeamUsers(teamId: Int!): [User!]!
    }

    type Mutation {
        registerUser(username: String!, email: String!, password: String!): RegisterResponse!
        authenticateUser(email: String!, password: String!): LoginResponse!
        deleteUser: VoidResponse!
    }

    type LoginResponse {
        success: Boolean!
        token: String
        refreshToken: String
        errors: [Error!]
    }
    
    type RegisterResponse {
        success: Boolean!
        user: User
        errors: [Error!]
    }
`;
