const { nanoid } = require('nanoid');

const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthorizationError = require('../../exception/AuthorizationError');

class PlaylistsService {
  constructor(pool, collaborationsService, activitiesService) {
    this._pool = pool;
    this._collaborationsService = collaborationsService;
    this._activitiesService = activitiesService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             LEFT JOIN users ON playlists.owner = users.id
             LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
             WHERE playlists.owner = $1 OR collaborations.user_id = $1
             GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongOnPlaylist(playlistId, songId, userId) {
    const checkSongQuery = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const songResult = await this._pool.query(checkSongQuery);
    if (!songResult.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const id = `playlist-songs-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambah kedalam playlist');
    }

    await this._activitiesService.addActivity({
      playlistId,
      songId,
      userId,
      action: 'add',
    });

    return result.rows[0].id;
  }

  async getPlaylistDetail(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username, songs.id AS song_id, songs.title, songs.performer 
             FROM playlists
             JOIN users ON playlists.owner = users.id 
             LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id 
             LEFT JOIN songs ON songs.id = playlist_songs.song_id
             WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Detail playlist tidak ditemukan');
    }

    const playlist = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: [],
    };

    if (result.rows[0].song_id) {
      playlist.songs = result.rows.map((songs) => ({
        id: songs.song_id,
        title: songs.title,
        performer: songs.performer,
      }));
    }

    return playlist;
  }

  async deleteSongOnPlaylist({ playlistId, songId, userId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus lagu pada playlist');
    }
    await this._activitiesService.addActivity({
      playlistId,
      songId,
      userId,
      action: 'delete',
    });
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      try {
        await this._collaborationsService.verifyCollaborations(
          playlistId,
          userId
        );
      } catch {
        throw e;
      }
    }
  }
}

module.exports = PlaylistsService;
