const PlaylistHandler = require('./PlaylistsHandler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '2.0.0',
  register: async (server, { service, validator }) => {
    const playlistHandler = new PlaylistHandler(service, validator);
    server.route(routes(playlistHandler));
  },
};
