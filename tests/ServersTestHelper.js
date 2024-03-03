/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const config = require('../src/Commons/config');

const ServersTestHelper = {
  async createAccessToken() {
    const userPayload = {
      id: 'user-123',
      username: 'developer',
      role: 'Admin'
    };

    const existingUser = await UsersTableTestHelper.findUsersById(userPayload.id);
    if (!existingUser.length) {
      await UsersTableTestHelper.addUser(userPayload);
    }

    return Jwt.token.generate(userPayload, config.auth.accessTokenKey);
  },
};

module.exports = ServersTestHelper;