import axios from 'axios';
import { auth } from '../testSetup';

let user;

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
        user = data.data.registerUser.user;
        expect(data).toMatchObject({
            'data': {
                'registerUser': {
                    'success': true,
                    'user': {
                        'id': expect.any(Number),
                        'username': 'tester',
                        'email': 'tester@test.com'
                    },
                    'errors': null
                }
            }
        });
    });

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

    test('GetSingleUser', async () => {
        const { token, refreshToken } = await auth(user);

        const resp = await axios.post('http://localhost:8080/graphql',
            {
                query: `
                query {
                    getSingleUser(userId: 1) {
                        id
                        username
                        email
                        teams {
                            id
                            name
                            description
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
                'getSingleUser': {
                    'id': 1,
                    'username': 'tester',
                    'email': 'tester@test.com',
                    'teams': [],
                }
            }
        });
    });

    test('GetUser', async () => {
        const { token, refreshToken } = await auth(user);

        const resp = await axios.post('http://localhost:8080/graphql',
            {
                query: `
                query {
                    getUser {
                        id
                        username
                        email
                        teams {
                            id
                            name
                            description
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
                'getUser': {
                    'id': 1,
                    'username': 'tester',
                    'email': 'tester@test.com',
                    'teams': [],
                }
            }
        });
    });

    test('DeleteUser', async () => {
        const { token, refreshToken } = await auth(user);

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
