class UserRepository {
  async addUser(registerUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async updateUser(registerUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getUserByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getPasswordByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getIdByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRoleByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteUserById(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserRepository;
