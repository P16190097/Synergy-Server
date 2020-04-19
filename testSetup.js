import axios from 'axios';

export const createLogin = async (name) => {
  const resp = await axios.post('http://localhost:8080/graphql', {
    query: `
      mutation {
          registerUser(username: "${name}", email: "${name}@test.com", password: "password") {
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
  const { data: { registerUser: { user } } } = resp.data;
  return user;
};

export const deleteLogin = async (token, refreshToken) => {
  await axios.post('http://localhost:8080/graphql',
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
};

export const auth = async (user) => {
  const auth = await axios.post('http://localhost:8080/graphql', {
    query: `
            mutation {
                authenticateUser(email: "${user.email}", password: "password") {
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
  return { token, refreshToken };
};
