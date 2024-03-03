class RegisteredUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, fullname, role } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
    this.role = role;
  }

  _verifyPayload({ id, username, fullname, role }) {
    if (!id || !username || !fullname || !role) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string' || typeof role !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredUser;
