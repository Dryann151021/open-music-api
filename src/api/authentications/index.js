const AuthenticationsHandler = require('./AuthenticationsHandler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '2.0.0',
  register: async (
    server,
    { service, usersService, tokenManager, validator }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      service,
      usersService,
      tokenManager,
      validator
    );
    server.route(routes(authenticationsHandler));
  },
};
