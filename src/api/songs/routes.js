const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongDetailHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongDetailHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongDetailHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
