const phieuDatTiecRoute = require("./phieudattiec.route");
const hoaDonRoute = require("./hoadon.route");

module.exports = (app) => {
 app.use("/phieudattiec", phieuDatTiecRoute);
 app.use("/phieudattiec/:id/hoadon", hoaDonRoute);
}