// Import các router
const caRouter = require('./ca.route.js');
const sanhRouter = require('./sanh.route.js');
const imageRouter = require('./image.route.js');

// Hàm gắn các route vào ứng dụng
function route(app) {
  app.use('/api/ca', caRouter); // Các endpoint như /api/ca
  app.use('/api/sanh', sanhRouter); // Các endpoint như /api/sanh
  app.use('/api/images', imageRouter); // Các endpoint như /api/images
}

module.exports = route;