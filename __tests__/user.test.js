import axios from 'axios';

describe('User resolvers', () => {
    test('allUsers', async () => {
        const resp = await axios.post('http://localhost:8080/graphql', {
            query: `
                query {
                    allUsers {
                        id
                        username
                        email
                    }
                }
            `,
        });

        const { data } = resp;
        expect(data).toMatchObject({
            'data': {
                'allUsers': [
                    {
                        'id': 1,
                        'username': 'mayoe',
                        'email': 'mayoe@live.co.uk'
                    }
                ]
            }
        });

    });
});
