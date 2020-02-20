export default `
    type User {
        id: Int!
        username: String!
        email: String!
        teams: [Team!]!
    }

    type Query {
        getUser(id: Int!): User!
        allUsers: [User!]!
    }

    type Mutation {
        registerUser(username: String!, email: String!, password: String!): RegisterResponse!
        authenticateUser(email: String!, password: String!): LoginResponse!
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
