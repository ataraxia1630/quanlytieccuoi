// Import các router
const caRouter = require('./ca.route.js');
const sanhRouter = require('./sanh.route.js');
const imageRouter = require('./image.route.js');
const monanRoutes = require('./monan.route');
const baocaoRoutes = require('./baocao.route');
const loaisanhRoutes = require('./loaisanh.route.js');
const danhsachtiec = require('./danhsachtiec.route.js');
const hoadon = require('./hoadon.route.js');
const phieuDatTiecRoutes = require('./phieudattiec.route.js');
const ctDatBanRoutes = require('./ct_datban.route.js');
const ctDichVuRoutes = require('./ct_dichvu.route.js');
const dichvuRoutes = require('./dichvu.route.js');


// phân quyền
const authRoutes = require('./auth.route.js');
const userRoutes = require('./user.route.js');
const groupRoutes = require('./nhom.route.js');
const permissionRoutes = require('./quyen.route.js');

const thamsoRoutes = require('./thamso.route.js')

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

  app.use('/api/phieudattiec', phieuDatTiecRoutes);
  app.use('/api/ct-datban', ctDatBanRoutes);
  app.use('/api/ct-dichvu', ctDichVuRoutes);
  app.use('/api/dichvu', dichvuRoutes);


  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/group', groupRoutes);
  app.use('/api/permission', permissionRoutes);

  app.use('/api/thamso', thamsoRoutes)

}

module.exports = route;
