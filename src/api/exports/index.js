const ExportsHandler = require('./Handler');
const routes = require('./routes');

module.exports = {
  name: '_export',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportsHandler(service, validator);
    server.route(routes(exportsHandler));
  },
};
