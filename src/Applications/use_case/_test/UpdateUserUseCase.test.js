const UpdateUserUseCase = require('../UpdateUserUseCase');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

describe('UpdateUserUseCase', () => {
  it('should update user by id', async () => {
    // Arrange
    const userRepositoryMock = {
      updateUser: jest.fn(),
    };
    const passwordHashMock = {
      hash: jest.fn().mockResolvedValue('hashed_password'),
    };
    const useCasePayload = {
      username: 'John',
      fullname: 'john',
      password: 'password123',
      role: 'user',
    };
    const updateUserUseCase = new UpdateUserUseCase({
      userRepository: userRepositoryMock,
      passwordHash: passwordHashMock,
    });

    // Act
    await updateUserUseCase.execute('user_id', useCasePayload);

    // Assert
    expect(userRepositoryMock.updateUser).toHaveBeenCalledWith('user_id', expect.any(RegisterUser));
    expect(passwordHashMock.hash).toHaveBeenCalledWith('password123');
  });
});