const { LoaiSanhService } = require('../services/loaisanh.service');

const LoaiSanhController = {
  getAllLoaiSanh: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filters = {
        price: {
          min: parseInt(req.query.minPrice) || 0,
          max: parseInt(req.query.maxPrice) || 10000000,
          priceOrder: req.query.priceOrder || 'ASC',
        },
        nameOrder: req.query.nameOrder || 'ASC',
      };

      const result = await LoaiSanhService.getAllLoaiSanh(page, limit, filters);

      return res.status(200).json({
        message: 'Get all LoaiSanh successfully',
        data: result.data,
        total: result.total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error fetching all LoaiSanh', error: error.message });
    }
  },

  getLoaiSanhById: async (req, res) => {
    try {
      const loaisanh = await LoaiSanhService.getLoaiSanhById(req.params.id);
      return res.status(200).json(loaisanh);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error fetching LoaiSanh', error: error.message });
    }
  },

  createLoaiSanh: async (req, res) => {
    try {
      const loaisanh = await LoaiSanhService.createLoaiSanh(req.body);
      return res
        .status(201)
        .json({ message: 'Create LoaiSanh successfully', data: loaisanh });
    } catch (error) {
      return res.status(500).json({
        message: 'Error creating LoaiSanh',
        error: error.message,
      });
    }
  },

  updateLoaiSanh: async (req, res) => {
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
      return res.status(500).json({
        message: 'Error updating LoaiSanh',
        error: error.message,
      });
    }
  },

  deleteLoaiSanh: async (req, res) => {
    try {
      const loaisanh = await LoaiSanhService.deleteLoaiSanh(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting LoaiSanh',
        error: error.message,
      });
    }
  },

  deleteAllLoaiSanh: async (req, res) => {
    try {
      await LoaiSanhService.deleteAllLoaiSanh();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting all LoaiSanh',
        error: error.message,
      });
    }
  },

  searchLoaiSanhByName: async (req, res) => {
    try {
      const { name } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filters = {
        price: {
          min: parseInt(req.query.minPrice) || 0,
          max: parseInt(req.query.maxPrice) || 10000000,
          priceOrder: req.query.priceOrder || 'ASC',
        },
        nameOrder: req.query.nameOrder || 'ASC',
      };
      const result = await LoaiSanhService.searchLoaiSanhByName(
        name,
        page,
        limit,
        filters
      );
      return res.status(200).json({
        message: 'Search LoaiSanh by name successfully',
        data: result.data,
        total: result.total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error searching LoaiSanh by name',
        error: error.message,
      });
    }
  },
};
module.exports = { LoaiSanhController };
