const ActivitiesHandler = require('./ActivitiesHandler');
const routes = require('./routes');

module.exports = {
  name: 'playlistActivities',
  version: '2.0.0',
  register: async (server, { service, playlistsService }) => {
    const activitiesHandler = new ActivitiesHandler(service, playlistsService);
    server.route(routes(activitiesHandler));
  },
};
