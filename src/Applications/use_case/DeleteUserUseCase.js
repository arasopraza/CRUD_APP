class DeleteUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    return this._userRepository.deleteUserById(useCasePayload);
  }
}

module.exports = DeleteUserUseCase;
