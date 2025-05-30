const { PhieuDatTiec, DichVu, Ct_DichVu, } = require('../models');
const { Op } = require('sequelize');
const CTDichVuService = require('../services/ct_dichvu.service');
const { post } = require('../routes/ca.route');



const CTDichVuCotroller = {
    getDsDichVu: async (req, res, next) => {
  try {
    const soPhieuDatTiec = req.params.soPhieuDatTiec;

    const dsDichVu = await Ct_DichVu.findAll({
      where: { SoPhieuDatTiec: soPhieuDatTiec },
      include: [{
        model: DichVu,
        attributes: ['TenDichVu']
      }],
      attributes: ['SoLuong', 'DonGia'],
    });

    if (!dsDichVu || dsDichVu.length === 0) {
      return res.status(404).json({ message: 'Không có danh sách dịch vụ' });
    }

    return res.json(dsDichVu);

  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy danh sách dịch vụ' });
  }
},

    getAllCTDichVuByPDTId: async (req, res, next) => {
        try {
            const ct = await CTDichVuService.getAllCTDichVuByPDTId(req.params.soPhieuDatTiec);
            res.json(ct);
        } catch (error) {
            next(error);
        }
    },


    getCTDichVuById: async (req, res, next) => {
        try {
            const soPdt = req.params.soPhieuDatTiec;
            const dv = req.params.maDichVu;
            console.log("params:", { soPdt, dv })

            const ct = await CTDichVuService.getCTDichVuById(soPdt, dv);
            res.json(ct);
        } catch (error) {
            next(error);
        }
    },


    createCTDichVu: async (req, res, next) => {
        try {
            const ct = await CTDichVuService.createCTDichVu(req.body);

            res.status(201).json({ message: 'Tạo chi tiết dịch vụ thành công', data: ct });
        } catch (error) {
            next(error);
        }
    },


    updateCTDichVu: async (req, res, next) => {
        try {
            const soPdt = req.params.soPhieuDatTiec;
            const dv = req.params.maDichVu;
            console.log('params:', req.params);

            if (!soPdt || !dv) throw new Error('soPhieuDatTiec and maDichVu is required');
            const ct = await CTDichVuService.updateCTDichVu(dv, soPdt, req.body);
            res.json({ message: 'Cập nhật chi tiết dịch vụ thành công', data: ct });
        } catch (error) {
            next(error);
        }
    },

    deleteCTDichVu: async (req, res, next) => {
        try {
            const soPdt = req.params.soPhieuDatTiec;
            const dv = req.params.maDichVu;

            if (!soPdt || !dv) throw new Error('soPhieuDatTiec and maDichVu is required');
            await CTDichVuService.deleteCTDichVu(dv, soPdt);
            res.json({ message: 'Xóa chi tiết dịch vụ thành công' });
        } catch (error) {
            next(error);
        }
    },
};
module.exports = CTDichVuCotroller;