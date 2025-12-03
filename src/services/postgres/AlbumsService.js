const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapAlbumToModel } = require('../../utils/mapDBToModel');

class AlbumsService {
  constructor(pool, cacheService) {
    this._pool = pool;
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumDetail(id) {
    try {
      const cachedAlbum = await this._cacheService.get(`album:${id}`);
      return JSON.parse(cachedAlbum);
    } catch {
      const albumQuery = {
        text: 'SELECT * FROM albums WHERE id = $1',
        values: [id],
      };

      const albumResult = await this._pool.query(albumQuery);
      if (!albumResult.rows.length) {
        throw new NotFoundError('Album tidak ditemukan');
      }

      const album = mapAlbumToModel(albumResult.rows[0]);

      const songsQuery = {
        text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
        values: [id],
      };

      const songsResult = await this._pool.query(songsQuery);
      album.songs = songsResult.rows;
      await this._cacheService.set(`album:${id}`, JSON.stringify(album));

      return album;
    }
  }

  async editAlbumDetail(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. id tidak ditemukan');
    }

    await this._cacheService.del(`album:${id}`);
  }

  async editAlbumCoverById(id, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal memperbarui cover album. Id tidak ditemukan'
      );
    }

    await this._cacheService.del(`album:${id}`);
  }

  async deleteAlbumDetail(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.del(`album:${id}`);
  }
}

module.exports = AlbumsService;
