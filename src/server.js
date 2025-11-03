require('dotenv').config();

const Hapi = require('@hapi/hapi');

// albums
const albums = require('./api/albums');
const albumValidator = require('./validator/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

// songs
const songs = require('./api/songs');
const songValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

// users
const users = require('./api/users');
const userValidator = require('./validator/users');
const UsersService = require('./services/postgres/UsersService');

const ClientError = require('./exception/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

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
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: userValidator,
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

      console.log(response);
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
