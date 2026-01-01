const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPayload(request.payload);

    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    const jsonMessage = JSON.stringify(message);

    await this._service.sendMessage('export:playlists', jsonMessage);

    const response = h.response({
      status: 'success',
      message: 'Permintaan dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
