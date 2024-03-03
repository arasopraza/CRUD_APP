const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServersTestHelper = require('../../../../tests/ServersTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'developertesting',
        password: 'secret',
        fullname: 'Developer Indonesia',
        role: 'User'
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Developer Indonesia',
        password: 'secret',
        role: 'User'
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'developer',
        password: 'secret',
        fullname: ['Developer Indonesia'],
        role: 'User'
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'developerindonesiadeveloperindonesiadeveloperindonesiadeveloper',
        password: 'secret',
        fullname: 'Developer Indonesia',
        role: 'User'
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'developer indonesia',
        password: 'secret',
        fullname: 'Developer Indonesia',
        role: 'User'
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'developer' });
      const requestPayload = {
        username: 'developer',
        fullname: 'Developer Indonesia',
        password: 'super_secret',
        role: 'User'
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });
  });

  describe('putUserByIdHandler', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dev',
        password: 'secret',
        fullname: 'Developer',
        role: 'User'
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/users/user-123',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.updatedUser).toBeDefined();
    });
  });

  describe('getUserByUsernameHandler', () => {
    it('should response 200 and persisted user', async () => {
      const server = await createServer(container);
      const accessToken = await ServersTestHelper.createAccessToken();

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/users/developer',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.user).toBeDefined();
    });

    it('should response 404 when user not exists', async () => {
      const server = await createServer(container);
      const accessToken = await ServersTestHelper.createAccessToken();

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/users/test',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert 
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });
  });

  describe('when DELETE /users', () => {
    it('should response 200 and return success', async () => {
      const server = await createServer(container);
      const accessToken = await ServersTestHelper.createAccessToken({ id: 'user-123', username: 'developer', role: 'Admin'});      

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/users/user-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when user not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServersTestHelper.createAccessToken({ id: 'user-125', username: 'developer', role: 'Admin'});
      
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/users/user-125',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Gagal menghapus user. Id tidak ditemukan');
    });
  });
});
