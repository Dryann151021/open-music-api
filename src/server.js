const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

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

// playlistActivities
const playlistActivities = require('./api/activities');
const ActivitiesService = require('./services/postgres/ActivitiesService');

// exports
const _exports = require('./api/exports');
const exportValidator = require('./validator/exports');
const ProduserService = require('./services/rabbitmq/ProducerService');

// uploads
const StorageService = require('./services/storage/StorageService');

// albumLikes
const albumLikes = require('./api/albumLikes');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');

// error handler
const ClientError = require('./exception/ClientError');

// config environment
const { config, pool } = require('./config');
const app = config.app;
const jwt = config.jwt;

const init = async () => {
  const albumsService = new AlbumsService(pool);
  const storageService = new StorageService(
    path.resolve(__dirname, 'api/uploads/file/images')
  );
  const songsService = new SongsService(pool);
  const usersService = new UsersService(pool);
  const authenticationsService = new AuthenticationsService(pool);
  const collaborationsService = new CollaborationsService(pool);
  const activitiesService = new ActivitiesService(pool);
  const albumLikesService = new AlbumLikesService(pool);
  const playlistsService = new PlaylistsService(
    pool,
    collaborationsService,
    activitiesService
  );

  const server = Hapi.server({
    port: app.port,
    host: app.host,
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
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: jwt.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: jwt.accessTokenAge,
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
        storageService,
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
    {
      plugin: playlistActivities,
      options: {
        service: activitiesService,
        playlistsService,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProduserService,
        playlistsService,
        validator: exportValidator,
      },
    },
    {
      plugin: albumLikes,
      options: {
        service: albumLikesService,
      },
    },
  ]);

  server.route({
    method: 'GET',
    path: '/upload/images/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'api/uploads/file/images'),
      },
    },
  });

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
      console.log(newResponse);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan di ${server.info.uri}`);
};

init();
