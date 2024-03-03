const config = require('../../../../Commons/config');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: handler.putUserByIdHandler,
  },
  {
    method: 'GET',
    path: '/users/{username}',
    handler: handler.getUserByUsernameHandler,
    options: {
      auth: config.auth.jwtStrategy,
      plugins: {
        hacli: {
          permissions: ['User']
        }
      }
    },
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: handler.deleteUserByIdHandler,
    options: {
      auth: config.auth.jwtStrategy,
      plugins: {
        hacli: {
          permissions: ['Admin']
        }
      }
    },
  }
]);

module.exports = routes;
