const DichVuService = require("../services/dichvu.service.js");
const ApiError = require("../utils/apiError.js");

const parsePagination = (req) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  return { limit, offset };
};

const DichVuController = {
  getAllDichVu: async (req, res, next) => {
    try {
      const { limit, offset } = parsePagination(req);
      const data = await DichVuService.getAllDichVu(limit, offset);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  getDichVuById: async (req, res, next) => {
    try {
      if (!req.params.id) {
        throw new ApiError(400, "ID dịch vụ không hợp lệ.");
      }
      const data = await DichVuService.getDichVuById(req.params.id);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  getActiveDichVu: async (req, res, next) => {
    try {
      const { limit, offset } = parsePagination(req);
      const data = await DichVuService.getActiveDichVu(limit, offset);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  createDichVu: async (req, res, next) => {
    try {
      const data = await DichVuService.createDichVu(req.body);
      res.status(201).json({ message: "Cập nhật dịch vụ thành công.", data });
    } catch (err) {
      next(err);
    }
  },

  updateDichVu: async (req, res, next) => {
    try {
      if (!req.params.id) {
        throw new ApiError(400, "ID dịch vụ không hợp lệ.");
      }
      const updated = await DichVuService.updateDichVu(req.params.id, req.body);
      res
        .status(200)
        .json({ message: "Cập nhật dịch vụ thành công.", updated });
    } catch (err) {
      next(err);
    }
  },

  deleteDichVu: async (req, res, next) => {
    try {
      if (!req.params.id) {
        throw new ApiError(400, "ID dịch vụ không hợp lệ.");
      }
      await DichVuService.deleteDichVu(req.params.id);
      res.status(200).json({ message: "Xóa dịch vụ thành công." });
    } catch (err) {
      next(err);
    }
  },

  searchDichVu: async (req, res, next) => {
    try {
      const { limit, offset } = parsePagination(req);
      const { maDichVu, tenDichVu, giaTu, giaDen, tinhTrang } = req.query;

      const parsedTinhTrang = tinhTrang
        ? Array.isArray(tinhTrang)
          ? tinhTrang
          : [tinhTrang]
        : undefined;

      const data = await DichVuService.searchDichVu(
        { maDichVu, tenDichVu, giaTu, giaDen, tinhTrang: parsedTinhTrang },
        limit,
        offset
      );

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = DichVuController;
