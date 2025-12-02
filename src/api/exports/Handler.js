const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    const jsonMessage = JSON.stringify(message);

    await this._service.postExportPlaylistsHandler(
      'export:playlists',
      jsonMessage
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
