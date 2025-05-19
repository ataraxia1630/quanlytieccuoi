const { PhieuDatTiec } = require('../models');
const { Op, fn, col, where } = require("sequelize");

// GET http://localhost:25053/danhsachtiec/
module.exports.index = async (req, res) => {
 const find = {}
 const orderBy = []

 if(req.query.tenChuRe) {
  find.tenChuRe = { [Op.like]: `%${req.query.tenChuRe}%`};
 }
 if(req.query.tenCoDau) {
  find.tenCoDau = { [Op.like]: `%${req.query.tenCoDau}%`};
 }
 if(req.query.sanh) {
  find.sanh = { [Op.like]: `%${req.query.sanh}%`};
 }

//front end se chi cho chon 1 option, asc or des theo ngay or sl ban
 if(req.query.sortBy && req.query.order) {
  orderBy.push([req.query.sortBy, req.query.order.toUpperCase()])
 }

 const phieudattiecs = await PhieuDatTiec.findAll({
  where: find,
  order: orderBy
 });

 return res.status(200).json(phieudattiecs);

}

// GET http://localhost:25053/danhsachtiec/detail/:id
module.exports.detail = async (req, res ) => {
 try 
 {
  const id = req.params.id;
  const phieudattiec = await PhieuDatTiec.findOne({
   where: {
    SoPhieuDatTiec: id,
   }
  });
  res.json(phieudattiec);
 } catch (error) {
  res.json("Khong tim thay phieu dat tiec");
  console.log(error);
 }
}

