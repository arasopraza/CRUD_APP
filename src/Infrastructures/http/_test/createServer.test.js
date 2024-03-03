const createServer = require('../createServer');
const ServersTestHelper = require('../../../../tests/ServersTestHelper');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'developer',
      fullname: 'Developer Indonesia',
      password: 'secret',
      role: 'User',
    };
    const server = await createServer({}); // fake injection
    const accessToken = await ServersTestHelper.createAccessToken();

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });
});