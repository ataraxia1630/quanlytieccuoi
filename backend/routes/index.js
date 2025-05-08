const monanRoutes = require('./monan.route');

function route(app) {
  app.use('/api/monan', monanRoutes);
}

module.exports = route;
