const e = require('express');
const { MonAnService } = require('../services/monan.service');
const ApiError = require('../utils/apiError');

const MonAnController = {
  getAvailableMonAn: async (req, res, next) => {
    try {
      const monans = await MonAnService.getAvailableMonAn();
      return res.status(200).json({
        message: 'Lay danh sach mon an AVAILABLE thanh cong',
        data: monans,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllMonAn: async (req, res, next) => {
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
        },
      };

      const result = await MonAnService.getAllMonAn(
        page,
        limit,
        filters,
        req.query.search,
        req.query.sort
      );

      return res.status(200).json({
        data: result.data,
        total: result.total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      next(error);
    }
  },

  getMonAnById: async (req, res, next) => {
    try {
      const monan = await MonAnService.getMonAnById(req.params.id);
      return res.status(200).json(monan);
    } catch (error) {
      next(error);
    }
  },

  createMonAn: async (req, res, next) => {
    try {
      const monan = await MonAnService.createMonAn(req.body);
      return res.status(201).json(monan);
    } catch (error) {
      next(error);
    }
  },

  updateMonAn: async (req, res, next) => {
    try {
      const monan = await MonAnService.updateMonAn(req.params.id, req.body);
      return res.status(200).json(monan);
    } catch (error) {
      next(error);
    }
  },

  deleteMonAn: async (req, res, next) => {
    try {
      await MonAnService.deleteMonAn(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  markAllMonAnAsDeleted: async (req, res, next) => {
    try {
      await MonAnService.markAllMonAnAsDeleted();
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { MonAnController };
