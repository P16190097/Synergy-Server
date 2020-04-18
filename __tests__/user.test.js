import axios from 'axios';

describe('User resolvers', () => {
    test('createUser', async () => {
        const resp = await axios.post('http://localhost:8080/graphql', {
            query: `
            mutation {
                registerUser(username: "tester", email: "tester@test.com", password: "password") {
                  success
                  user {
                    id
                    username
                    email
                  }
                  errors {
                    path
                    message
                  }
                }
            }
            `,
        });

        const { data } = resp;
        expect(data).toMatchObject({
            'data': {
                'registerUser': {
                    'success': true,
                    'user': {
                        'id': 1,
                        'username': 'tester',
                        'email': 'tester@test.com'
                    },
                    'errors': null
                }
            }
        });
    });

    // test('allUsers', async () => {
    //     const resp = await axios.post('http://localhost:8080/graphql', {
    //         query: `
    //             query {
    //                 allUsers {
    //                     id
    //                     username
    //                     email
    //                 }
    //             }
    //         `,
    //     });

    //     const { data } = resp;
    //     expect(data).toMatchObject({
    //         'data': {
    //             'allUsers': [
    //                 {
    //                     'id': 1,
    //                     'username': 'tester',
    //                     'email': 'tester@test.com'
    //                 }
    //             ]
    //         }
    //     });
    // });

    test('AuthenticateUser', async () => {
        const resp = await axios.post('http://localhost:8080/graphql', {
            query: `
            mutation {
                authenticateUser(email: "tester@test.com", password: "password") {
                  success
                  token
                  refreshToken
                  errors {
                    path
                    message
                  }
                }
            }
            `,
        });

        const { data } = resp;
        expect(data).toMatchObject({
            'data': {
                'authenticateUser': {
                    'success': true,
                    'token': expect.any(String),
                    'refreshToken': expect.any(String),
                    'errors': null
                }
            }
        });
    });

    test('DeleteUser', async () => {
        const auth = await axios.post('http://localhost:8080/graphql', {
            query: `
            mutation {
                authenticateUser(email: "tester@test.com", password: "password") {
                  success
                  token
                  refreshToken
                  errors {
                    path
                    message
                  }
                }
            }
            `,
        });

        const { data: { authenticateUser: { token, refreshToken } } } = auth.data;

        console.log(token, refreshToken);

        const resp = await axios.post('http://localhost:8080/graphql',
            {
                query: `
                mutation {
                    deleteUser {
                        success
                        errors {
                            path
                            message
                        }
                    }

                }
            `,
            },
            {
                headers: {
                    'x-token': token,
                    'x-refresh-token': refreshToken,
                },
            }
        );
        const { data } = resp;
        expect(data).toMatchObject({
            'data': {
                'deleteUser': {
                    'success': true,
                    'errors': null
                }
            }
        });
    });
});
