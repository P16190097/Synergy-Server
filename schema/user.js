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
        registerUser(username: String!, email: String!, password: String!): User!
    }
    
    type RegisterResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }
`;