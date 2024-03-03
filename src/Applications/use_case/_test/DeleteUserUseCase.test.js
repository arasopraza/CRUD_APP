const DeleteUserUseCase = require('../DeleteUserUseCase');

describe('DeleteUserUseCase', () => {
  it('should delete user by id', async () => {
    // Arrange
    const userRepositoryMock = {
      deleteUserById: jest.fn(),
    };
    const useCasePayload = 'user_id';
    const deleteUserUseCase = new DeleteUserUseCase({
      userRepository: userRepositoryMock,
    });

    // Act
    await deleteUserUseCase.execute(useCasePayload);

    // Assert
    expect(userRepositoryMock.deleteUserById).toHaveBeenCalledWith(useCasePayload);
  });
});