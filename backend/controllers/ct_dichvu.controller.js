const Ct_DichVuService = require("../services/ct_dichvu.service.js");

const parsePagination = (req) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  return { limit, offset };
};

const Ct_DichVuController = {
  getAllCt_DichVu: async (req, res, next) => {
    try {
      const { limit, offset } = parsePagination(req);
      const data = await Ct_DichVuService.getAllCt_DichVu(limit, offset);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  getCt_DichVuById: async (req, res, next) => {
    try {
      const { maDichVu, soPhieuDatTiec } = req.params;
      const data = await Ct_DichVuService.getCt_DichVuById(
        maDichVu,
        soPhieuDatTiec
      );
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  createCt_DichVu: async (req, res, next) => {
    try {
      const data = await Ct_DichVuService.createCt_DichVu(req.body);
      res.status(201).json({
        data,
        message: "Tạo chi tiết dịch vụ thành công.",
      });
    } catch (err) {
      next(err);
    }
  },

  updateCt_DichVu: async (req, res, next) => {
    try {
      const { maDichVu, soPhieuDatTiec } = req.params;
      const updated = await Ct_DichVuService.updateCt_DichVu(
        maDichVu,
        soPhieuDatTiec,
        req.body
      );
      res.status(200).json({
        data: { affectedRows: updated },
        message: "Cập nhật chi tiết dịch vụ thành công.",
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = Ct_DichVuController;
