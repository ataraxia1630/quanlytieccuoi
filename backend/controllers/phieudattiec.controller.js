const { PhieuDatTiec } = require('../models');

// GET http://localhost:25053/phieudattiec/
module.exports.index = async (req, res) => {
 const find = {
 }

 // if(req.query.trangthai) {
 //  find.trangthai = req.query.trangthai;
 // }

 //pagination

 //search

 const phieudattiecs = await PhieuDatTiec.findAll({where: find})

 res.json(phieudattiecs);
}

// GET http://localhost:25053/phieudattiec/detail/:id
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

