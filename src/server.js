require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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

// authentications
const authentications = require('./api/authentications');
const authenticationValidator = require('./validator/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const tokenManager = require('./tokenize/tokenManager');

// playlists
const playlists = require('./api/playlists');
const playlistValidator = require('./validator/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');

// collaborations
const collaborations = require('./api/collaborations');
const collaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');

const ClientError = require('./exception/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        service: authenticationsService,
        usersService,
        tokenManager,
        validator: authenticationValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: playlistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        playlistsService,
        validator: collaborationsValidator,
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
