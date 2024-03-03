const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class UpdateUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(id, useCasePayload) {
    const user = new RegisterUser(useCasePayload);
    user.password = await this._passwordHash.hash(user.password);
    return this._userRepository.updateUser(id, user);
  }
}

module.exports = UpdateUserUseCase;
