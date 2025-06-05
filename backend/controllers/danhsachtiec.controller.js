const { PhieuDatTiec, Ca, Sanh } = require('../models');
const { Op, fn, col, where } = require("sequelize");

// GET http://localhost:25053/api/danhsachtiec/
module.exports.index = async (req, res) => {
  try {
    const phieudattiecs = await PhieuDatTiec.findAll({
      include: [
        {
          model: Sanh,
          as: 'Sanh',
          attributes: ['TenSanh']
        }
      ],
    });
    return res.status(200).json(phieudattiecs);
  } catch (er) {
    console.error(er)
  }
}

module.exports.filter = async (req, res) => {
  const { ten, sanh, tuNgay, denNgay, tuBan, denBan, trangThai } = req.body;

  const where = {};
  if (ten) {
    where[Op.or] = [
      { tenChuRe: { [Op.like]: `%${ten}%` } },
      { tenCoDau: { [Op.like]: `%${ten}%` } },
    ];
  }
  if (sanh) where[`$Sanh.TenSanh$`] = { [Op.like]: `%${sanh}%` };
  if (tuNgay && denNgay) {
    where.ngayDaiTiec = {
      [Op.between]: [new Date(tuNgay), new Date(denNgay)],
    };
  }
  if (tuBan && denBan) {
    where.soluongban = {
      [Op.between]: [tuBan, denBan],
    };
  }
  if(trangThai) {
    where.trangthai = trangThai;
  }

  const danhSach = await PhieuDatTiec.findAll({
    where,
    include: [
      {
        model: Sanh,
        attributes: ['TenSanh'],
      },
    ],
  });
  res.json(danhSach);
};
// GET http://localhost:25053/api/danhsachtiec/detail/:id
module.exports.detail = async (req, res) => {
  try {
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

