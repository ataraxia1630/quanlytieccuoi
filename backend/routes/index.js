const monanRoutes = require('./monan.route');
const baocaoRoutes = require('./baocao.route');

function route(app) {
  app.use('/api/monan', monanRoutes);
  app.use('/api/baocao', baocaoRoutes);
}

module.exports = route;
