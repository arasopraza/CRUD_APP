const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname, role } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id, username, fullname, role',
      values: [id, username, password, fullname, role],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async updateUser(id, registerUser) {
    const { username, password, fullname, role } = registerUser;

    const query = {
      text: 'UPDATE users SET username = $1, password = $2, fullname = $3, role = $4 WHERE id = $5 RETURNING id, username, fullname, role',
      values: [username, password, fullname, role, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal memperbarui user. Id tidak ditemukan');
    }

    return new RegisteredUser({ ...result.rows[0] });
  }
  
  async getUserByUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('username tidak tersedia');
    }

    return result.rows[0];
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async getRoleByUsername(username) {
    const query = {
      text: 'SELECT role FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { role } = result.rows[0];

    return role;
  }

  async deleteUserById(id) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus user. Id tidak ditemukan');
    }
  }
}

module.exports = UserRepositoryPostgres;
