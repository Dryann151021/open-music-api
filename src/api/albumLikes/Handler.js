const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  postAlbumLikeHandler = async (request, h) => {
    const { albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.addAlbumLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  };

  deleteAlbumLikeHandler = async (request, h) => {
    const { albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.deleteAlbumLike(albumId, userId);
    const response = h.response({
      status: 'success',
      message: 'Batal menyukai album',
    });
    response.code(200);
    return response;
  };

  getAlbumLikeHandler = async (request, h) => {
    const { albumId } = request.params;

    const likes = await this._service.getAlbumLikes(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    return response;
  };
}

module.exports = AlbumLikesHandler;
