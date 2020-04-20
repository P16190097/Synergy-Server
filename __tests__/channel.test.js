/* eslint-disable no-unused-vars */
import axios from 'axios';
import { auth, createLogin, createTeam } from '../testSetup';

let user;
let team;
let channel;

describe('Channel and message resolvers', () => {
    beforeAll(async () => {
        user = await createLogin('channelTester');
        team = await createTeam(user, 'channelTestTeam');
    });

    test('Create Channel', async () => {
        const { token, refreshToken } = await auth(user);

        const resp = await axios.post('http://localhost:8080/graphql',
            {
                query: `
                    mutation {
                        createChannel(teamId: ${team.id}, name: "test channel") {
                            success
                            channel {
                                id
                                name
                            }
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
        channel = data.data.createChannel.channel;
        expect(data).toMatchObject({
            'data': {
                'createChannel': {
                    'success': true,
                    'channel': {
                        'id': expect.any(Number),
                        'name': 'test channel',
                    },
                    'errors': null,
                },
            }
        });
    });

    test('Create Message', async () => {
        const { token, refreshToken } = await auth(user);

        const resp = await axios.post('http://localhost:8080/graphql',
            {
                query: `
                    mutation {
                        createMessage(channelId: ${channel.id}, text: "test message") {
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
                'createMessage': {
                    'success': true,
                    'errors': null,
                },
            }
        });
    });

    test('Get Messages', async () => {
        const { token, refreshToken } = await auth(user);

        const resp = await axios.post('http://localhost:8080/graphql',
            {
                query: `
                    query {
                        getMessages(channelId: ${channel.id}) {
                            id
                            text
                            user {
                                id 
                                username
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
                'getMessages': [{
                    'id': 1,
                    'text': 'test message',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                    }
                }]
            }
        });
    });

    test('Delete Message', async () => {
        const { token, refreshToken } = await auth(user);

        const resp = await axios.post('http://localhost:8080/graphql',
            {
                query: `
                    mutation {
                        deleteMessage(teamId: ${team.id}, messageId: 1) {
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
                'deleteMessage': {
                    'success': true,
                    'errors': null,
                },
            }
        });
    });
});
