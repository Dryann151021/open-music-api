const ExportsHandler = require('./ExportsHandler');
const routes = require('./routes');

module.exports = {
  name: '_export',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(
      service,
      playlistsService,
      validator
    );
    server.route(routes(exportsHandler));
  },
};
