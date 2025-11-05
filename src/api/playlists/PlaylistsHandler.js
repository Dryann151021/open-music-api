const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credetialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credetialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    const response = h.response({
      status: 'success',
      message: 'playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postSongOnPlaylistHandler(request, h) {
    this._validator.validateSongOnPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, userId);
    const playlistSongsId = await this._service.addSongOnPlaylist(
      playlistId,
      songId
    );

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan kedalam playlist',
      data: {
        playlistSongsId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistDetailHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getPlaylistDetail(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongOnPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteSongOnPlaylist({ playlistId, songId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus pada playlist',
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;
