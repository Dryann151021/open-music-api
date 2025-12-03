const { nanoid } = require('nanoid');
const NotFoundError = require('../../exception/NotFoundError');
const InvariantError = require('../../exception/InvariantError');

class AlbumLikesService {
  constructor(pool, cacheService) {
    this._pool = pool;
    this._cacheService = cacheService;
  }

  async addAlbumLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const albumQuery = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const albumResult = await this._pool.query(albumQuery);
    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const likeCheckQuery = {
      text: 'SELECT id FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const likeResult = await this._pool.query(likeCheckQuery);
    if (likeResult.rows.length) {
      throw new InvariantError('Anda telah menyukai album ini sebelumnya');
    }

    const query = {
      text: 'INSERT INTO album_likes (id, album_id, user_id) VALUES ($1, $2, $3)',
      values: [id, albumId, userId],
    };

    await this._cacheService.del(`likes:${albumId}`);
    await this._pool.query(query);
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Like tidak ditemukan');
    }

    await this._cacheService.del(`likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        likes: Number(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = Number(result.rows[0].count);

      await this._cacheService.set(`likes:${albumId}`, likes);

      return {
        likes,
        source: 'database',
      };
    }
  }
}

module.exports = AlbumLikesService;
