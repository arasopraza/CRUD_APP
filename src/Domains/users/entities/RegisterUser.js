class RegisterUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { username, password, fullname, role } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
    this.role = role;
  }

  _verifyPayload({ username, password, fullname, role}) {
    if (!username || !password || !fullname || !role) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string' || typeof role !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = RegisterUser;
