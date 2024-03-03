const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');
const DeleteUserUseCase = require('../../../../Applications/use_case/DeleteUserUseCase');
const GetUserByUsernameUseCase = require('../../../../Applications/use_case/GetUserByUsernameUseCase');
const UpdateUserUseCase = require('../../../../Applications/use_case/UpdateUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.putUserByIdHandler = this.putUserByIdHandler.bind(this);
    this.getUserByUsernameHandler = this.getUserByUsernameHandler.bind(this);
    this.deleteUserByIdHandler = this.deleteUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        addedUser,
      },
    }).code(201);
  }

  async putUserByIdHandler(request, h) {
    const { id } = request.params;
    const updateUserUseCase = this._container.getInstance(UpdateUserUseCase.name);
    const updatedUser = await updateUserUseCase.execute(id, request.payload);
    
    return h.response({
      status: 'success',
      data: {
        updatedUser,
      },
    }).code(201);
  }

  async getUserByUsernameHandler(request, h) {
    const { username } = request.params;
    const getUserByUsernameUseCase = this._container.getInstance(GetUserByUsernameUseCase.name);
    const user = await getUserByUsernameUseCase.execute(username);

    return h.response({
      status: 'success',
      data: {
        user,
      },
    }).code(200);
  }

  async deleteUserByIdHandler(request, h) {
    const { id } = request.params;
    const deleteUserUseCase = this._container.getInstance(DeleteUserUseCase.name);
    await deleteUserUseCase.execute(id);

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = UsersHandler;
