const e = require('express');
const { MonAnService } = require('../services/monan.service');

const MonAnController = {
  getAllMonAn: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filters = {
        status: req.query.status?.split(',') || [
          'AVAILABLE',
          'UNAVAILABLE',
          'NO_LONGER_AVAILABLE',
        ],
        price: {
          min: parseInt(req.query.minPrice) || 0,
          max: parseInt(req.query.maxPrice) || 10000000,
          priceOrder: req.query.priceOrder || 'ASC',
        },
        nameOrder: req.query.nameOrder || 'ASC',
      };

      const result = await MonAnService.getAllMonAn(page, limit, filters);

      return res.status(200).json({
        data: result.data,
        total: result.total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error fetching all MonAns', error: error.message });
    }
  },

  getMonAnById: async (req, res) => {
    try {
      const monan = await MonAnService.getMonAnById(req.params.id);
      return res.status(200).json(monan);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error fetching MonAn by ID', error: error.message });
    }
  },

  createMonAn: async (req, res) => {
    try {
      const monan = await MonAnService.createMonAn(req.body);
      return res.status(201).json(monan);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error creating MonAn', error: error.message });
    }
  },

  updateMonAn: async (req, res) => {
    try {
      const monan = await MonAnService.updateMonAn(req.params.id, req.body);
      return res.status(200).json(monan);
    } catch (error) {
      return res.status(500).json({
        message: 'Error updating MonAn',
        error: error.message,
      });
    }
  },

  deleteMonAn: async (req, res) => {
    try {
      await MonAnService.deleteMonAn(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting MonAn',
        error: error.message,
      });
    }
  },

  markAllMonAnAsDeleted: async (req, res) => {
    try {
      await MonAnService.markAllMonAnAsDeleted();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting all MonAns',
        error: error.message,
      });
    }
  },

  searchMonAnByName: async (req, res) => {
    const { name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      status: req.query.status?.split(',') || [
        'AVAILABLE',
        'UNAVAILABLE',
        'NO_LONGER_AVAILABLE',
      ],
      price: {
        min: parseInt(req.query.minPrice) || 0,
        max: parseInt(req.query.maxPrice) || 10000000,
        priceOrder: req.query.priceOrder || 'ASC',
      },
      nameOrder: req.query.nameOrder || 'ASC',
    };

    try {
      const result = await MonAnService.searchMonAnByName(
        name,
        page,
        limit,
        filters
      );

      if (!result.data || result.data.length === 0) {
        return res.status(404).json({ message: 'No MonAn found' });
      }

      return res.status(200).json({
        data: result.data,
        total: result.total,
        currentPage: page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error searching MonAn by name',
        error: error.message,
      });
    }
  },
};

module.exports = { MonAnController };
