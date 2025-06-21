const { LoaiSanhService } = require('../services/loaisanh.service');

const LoaiSanhController = {
  getAllLoaiSanh: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filters = {
        price: {
          min: parseInt(req.query.minPrice) || 0,
          max: parseInt(req.query.maxPrice) || 99999999,
        },
      };

      const result = await LoaiSanhService.getAllLoaiSanh(
        page,
        limit,
        filters,
        req.query.search,
        req.query.sort
      );

      return res.status(200).json({
        message: 'Get all LoaiSanh successfully',
        data: result.data,
        total: result.total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      next(error);
    }
  },

  getLoaiSanhById: async (req, res, next) => {
    try {
      const loaisanh = await LoaiSanhService.getLoaiSanhById(req.params.id);
      return res.status(200).json(loaisanh);
    } catch (error) {
      next(error);
    }
  },

  createLoaiSanh: async (req, res, next) => {
    try {
      const loaisanh = await LoaiSanhService.createLoaiSanh(req.body);
      return res
        .status(201)
        .json({ message: 'Create LoaiSanh successfully', data: loaisanh });
    } catch (error) {
      next(error);
    }
  },

  updateLoaiSanh: async (req, res, next) => {
    try {
      const loaisanh = await LoaiSanhService.updateLoaiSanh(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        message: 'Update LoaiSanh successfully',
        data: loaisanh,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteLoaiSanh: async (req, res, next) => {
    try {
      const message = await LoaiSanhService.deleteLoaiSanh(req.params.id);
      return res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  },

  deleteAllLoaiSanh: async (req, res, next) => {
    try {
      await LoaiSanhService.deleteAllLoaiSanh();
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
module.exports = { LoaiSanhController };
