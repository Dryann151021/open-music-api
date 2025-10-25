require('dotenv').config();

const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const song = require('./api/song');
const albumValidator = require('./validator/album');
const songValidator = require('./validator/song');
const AlbumService = require('./services/postgres/AlbumService');
const SongService = require('./services/postgres/SongService');
const ClientError = require('./exception/ClientError');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: albumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: songValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (Request, h) => {
    const { response } = Request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return response;
      }

      const newResponse = h.response({
        status: 'fail',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan di ${server.info.uri}`);
};

init();
