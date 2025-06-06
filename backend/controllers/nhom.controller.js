const { GroupService } = require('../services/nhom.service');

const GroupController = {
  createNew: async (req, res, next) => {
    try {
      const group = await GroupService.createNew(req.body);
      return res.status(201).json({ group });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { MaNhom } = req.params;
      const group = await GroupService.update(MaNhom, req.body);
      return res.status(200).json({ group });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { MaNhom } = req.params;
      await GroupService.delete(MaNhom);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const groups = await GroupService.getAll();
      return res.status(200).json({ groups });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { GroupController };
