const Usershandler = require('./UsersHandler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '2.0.0',
  register: async (server, { service, validator }) => {
    const usersHandler = new Usershandler(service, validator);
    server.route(routes(usersHandler));
  },
};
