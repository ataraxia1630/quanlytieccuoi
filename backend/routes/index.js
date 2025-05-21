// Import các router
const caRouter = require('./ca.route.js');
const sanhRouter = require('./sanh.route.js');
const imageRouter = require('./image.route.js');
const monanRoutes = require('./monan.route');
const baocaoRoutes = require('./baocao.route');
const loaisanhRoutes = require('./loaisanh.route.js');
const dichvuRoutes = require('./dichvu.route.js');
const ct_dichvuRoutes = require('./ct_dichvu.route.js');

// Hàm gắn các route vào ứng dụng
function route(app) {
  app.use('/api/ca', caRouter); // Các endpoint như /api/ca
  app.use('/api/sanh', sanhRouter); // Các endpoint như /api/sanh
  app.use('/api/images', imageRouter); // Các endpoint như /api/images
  app.use('/api/monan', monanRoutes);
  app.use('/api/baocao', baocaoRoutes);
  app.use('/api/loaisanh', loaisanhRoutes);
  app.use('/api/dichvu', dichvuRoutes);
  app.use('/api/ct_dichvu', ct_dichvuRoutes);
}

module.exports = route;
