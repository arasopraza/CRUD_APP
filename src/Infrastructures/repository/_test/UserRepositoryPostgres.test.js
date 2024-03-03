const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({}); // memasukan user baru dengan username developer
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('developer')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('developer')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'developer',
        password: 'secret_password',
        fullname: 'Developer Indonesia',
        role: 'User'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'developer',
        password: 'secret_password',
        fullname: 'Developer Indonesia',
        role: 'User'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'developer',
        fullname: 'Developer Indonesia',
        role: 'User'
      }));
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('developer'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'developer',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('developer');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('developer'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'developer' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('developer');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });

  describe('getRoleByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getRoleByUsername('developer'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user role correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'developer', role: 'User' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userRole = await userRepositoryPostgres.getRoleByUsername('developer');

      // Assert
      expect(userRole).toEqual('User');
    });
  });

  describe('getUserByUsername', () => {
    it('should throw NotFoundError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getUserByUsername('acong'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return user correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'developer' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const user = await userRepositoryPostgres.getUserByUsername('developer');

      // Assert
      expect(user.id).toEqual('user-321');
      expect(user.username).toEqual('developer');
    });
  });

  describe('updateUser function', () => {
    it('should update user and return registered user correctly', async () => {
      // Arrange
      const id = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepositoryPostgres.addUser({
        username: 'new_dev',
        password: 'new_password',
        fullname: 'New Dev',
        role: 'User'
      });

      const registerUser = new RegisterUser({
        username: 'developer',
        password: 'new_password',
        fullname: 'Developer',
        role: 'User'
      });

      // Action
      const updatedUser = await userRepositoryPostgres.updateUser(id, registerUser);

      // Assert
      expect(updatedUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'developer',
        fullname: 'Developer',
        role: 'User'
      }));
    });

    it('should throw InvariantError when user id not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dev' });
      const registerUser = new RegisterUser({
        username: 'new_dev',
        password: 'new_password',
        fullname: 'New Dev',
        role: 'User'
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.updateUser('user-456', registerUser)).rejects.toThrowError(InvariantError);
    });
  });

  describe('deleteUserById function', () => {
    it('should delete user by id and return the deleted user id', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser({
        username: 'new_dev',
        password: 'new_password',
        fullname: 'New Dev',
        role: 'User'
      });

      // Action
      await userRepositoryPostgres.deleteUserById('user-123');

      // Assert
      await expect(userRepositoryPostgres.getIdByUsername('new_dev')).rejects.toThrowError(InvariantError);
    });

    it('should throw NotFoundError when user id not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dev' });
   
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.deleteUserById('user-456')).rejects.toThrowError(NotFoundError);
    });
  });
});