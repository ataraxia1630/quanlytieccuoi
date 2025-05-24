// Import các router
const caRouter = require('./ca.route.js');
const sanhRouter = require('./sanh.route.js');
const imageRouter = require('./image.route.js');
const monanRoutes = require('./monan.route');
const baocaoRoutes = require('./baocao.route');
const loaisanhRoutes = require('./loaisanh.route.js');
const danhsachtiec = require('./danhsachtiec.route.js');
const hoadon = require('./hoadon.route.js')
// Hàm gắn các route vào ứng dụng
function route(app) {
  app.use('/api/ca', caRouter); // Các endpoint như /api/ca
  app.use('/api/sanh', sanhRouter); // Các endpoint như /api/sanh
  app.use('/api/images', imageRouter); // Các endpoint như /api/images
  app.use('/api/monan', monanRoutes);
  app.use('/api/baocao', baocaoRoutes);
  app.use('/api/loaisanh', loaisanhRoutes);
  app.use('/api/danhsachtiec', danhsachtiec)
  app.use('/api/danhsachtiec/hoadon', hoadon)
}

module.exports = route;
