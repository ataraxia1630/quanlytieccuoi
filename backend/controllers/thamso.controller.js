const ThamSoService = require('../services/thamso.service')

const ThamSoController = {
  getAllThamSo: async (req, res, next) => {
    try {
      const { limit, offset, search } = req.query;
      const data = await ThamSoService.getAllThamSo(
        parseInt(limit) || 10,
        parseInt(offset) || 0,
        search || ''
      );
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  getThamSoByName: async (req, res, next) => {
    try {
      const tenThamSo = req.params.tenThamSo;
      const data = await ThamSoService.getThamSoByName(tenThamSo);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  updateThamSo: async (req, res, next) => {
    try {
      const tenThamSo = req.params.tenThamSo;
      const { GiaTri } = req.body;
      const data = await ThamSoService.updateThamSo(tenThamSo, GiaTri);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ThamSoController;
