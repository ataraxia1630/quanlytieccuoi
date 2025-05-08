const e = require('express');
const { MonAnService } = require('../services/monan.service');

const MonAnController = {
  getAllMonAn: async (req, res) => {
    try {
      // pagination, sorting, filtering logic can be added here
      const monans = await MonAnService.getAllMonAn();
      return res.status(200).json(monans);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error fetching all MonAns', error: error.message });
    }
  },

  getMonAnById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('id is required');
      const monan = await MonAnService.getMonAnById(id);
      if (!monan) {
        return res.status(404).json({ message: 'MonAn not found' });
      }
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
      const { id } = req.params;
      if (!id) throw new Error('id is required');
      const monan = await MonAnService.updateMonAn(id, req.body);
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
      const { id } = req.params;
      if (!id) throw new Error('id is required');
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
    try {
      const monans = await MonAnService.searchMonAnByName(name);
      if (!monans || monans.length === 0) {
        return res.status(404).json({ message: 'No MonAn found' });
      }
      return res.status(200).json(monans);
    } catch (error) {
      return res.status(500).json({
        message: 'Error searching MonAn by name',
        error: error.message,
      });
    }
  },
};

module.exports = { MonAnController };
