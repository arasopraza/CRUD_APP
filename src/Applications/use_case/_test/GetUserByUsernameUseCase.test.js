const GetUserByUsernameUseCase = require('../GetUserByUsernameUseCase');

describe('GetUserByUsernameUseCase', () => {
  it('should get user by username', async () => {
    // Arrange
    const userRepositoryMock = {
      getUserByUsername: jest.fn().mockReturnValue('user'),
    };
    const useCasePayload = 'username';
    const getUserByUsernameUseCase = new GetUserByUsernameUseCase({
      userRepository: userRepositoryMock,
    });

    // Act
    const result = await getUserByUsernameUseCase.execute(useCasePayload);

    // Assert
    expect(userRepositoryMock.getUserByUsername).toHaveBeenCalledWith(useCasePayload);
    expect(result).toBe('user');
  });
});