const { PhieuDatTiec, Ca, Sanh } = require('../models');
const { Op, fn, col, where } = require("sequelize");

// GET http://localhost:25053/api/danhsachtiec/
module.exports.index = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const { count: totalItems, rows: phieudattiecs } = await PhieuDatTiec.findAndCountAll({
      include: [
        {
          model: Sanh,
          as: 'Sanh',
          attributes: ['TenSanh']
        }
      ],
      offset,
      limit
    });

    return res.status(200).json({
      data: phieudattiecs,
      totalItems
    });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ error: "Lỗi server khi lấy danh sách phiếu đặt tiệc" });
  }
};


module.exports.filter = async (req, res) => {
  const { ten, sanh, tuNgay, denNgay, tuBan, denBan, trangThai } = req.body;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  const where = {};
  if (ten) {
    where[Op.or] = [
      { tenChuRe: { [Op.like]: `%${ten}%` } },
      { tenCoDau: { [Op.like]: `%${ten}%` } },
      { SoPhieuDatTiec: { [Op.like]: `%${ten}%` } },

    ];
  }
  if (sanh) where[`$Sanh.TenSanh$`] = { [Op.like]: `%${sanh}%` };
  if (tuNgay && denNgay) {
    where.ngayDaiTiec = {
      [Op.between]: [
        new Date(tuNgay),
        new Date(`${denNgay}T23:59:59`)
      ],
    };

  }
  else if (tuNgay) {
    where.ngayDaiTiec = {
      [Op.gte]: new Date(tuNgay),
    };
  }
  else if (denNgay) {
    where.ngayDaiTiec = {
      [Op.lte]: new Date(`${denNgay}T23:59:59`),
    };
  }

  if (tuBan != null && denBan != null) {
    where.soLuongBan = { [Op.between]: [tuBan, denBan] };
  } else if (tuBan != null) {
    where.soLuongBan = { [Op.gte]: tuBan };
  } else if (denBan != null) {
    where.soLuongBan = { [Op.lte]: denBan };
  }

  if (trangThai) {
    where.trangthai = trangThai;
  }

  const { count: totalItems, rows: phieudattiecs } = await PhieuDatTiec.findAndCountAll({
    where,
    include: [
      {
        model: Sanh,
        attributes: ['TenSanh'],
      },
    ]
    ,
    offset,
    limit
  });
  return res.status(200).json({
    data: phieudattiecs,
    totalItems
  });
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

