const phieuDatTiecRoute = require("./danhsachtiec.route");
const hoaDonRoute = require("./hoadon.route");

module.exports = (app) => {
 app.use("/danhsachtiec", phieuDatTiecRoute);
 app.use("/danhsachtiec/:id/hoadon", hoaDonRoute);
}