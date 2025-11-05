const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = nanoid(16);

    const userQuery = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };

    const userResult = await this._pool.query(userQuery);
    if (!userResult.rows.length) {
      throw new NotFoundError('User yang akan ditambahkan tidak ditemukan');
    }

    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Collaborations gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaborations(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Collaborations gagal dihapus');
    }
  }

  async verifyCollaborations(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Collaborations gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
