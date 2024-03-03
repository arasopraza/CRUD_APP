class GetUserByUsernameUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    return this._userRepository.getUserByUsername(useCasePayload);
  }
}

module.exports = GetUserByUsernameUseCase;
