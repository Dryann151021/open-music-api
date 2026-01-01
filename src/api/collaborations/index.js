const CollaborationsHandler = require('./CollaborationsHandler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '2.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      service,
      playlistsService,
      validator
    );
    server.route(routes(collaborationsHandler));
  },
};
