const { UserService } = require('../services/user.service');

const UserController = {
  createAccount: async (req, res, next) => {
    try {
      const newUser = await UserService.createAccount(req.body);
      return res.status(201).json({ newUser });
    } catch (error) {
      next(error);
    }
  },

  deleteAccount: async (req, res, next) => {
    try {
      const { username } = req.params;
      await UserService.deleteAccount(username);
      return res.json(204).send();
    } catch (error) {
      next(error);
    }
  },

  updateAccount: async (req, res, next) => {
    try {
      const { username } = req.params;
      const updatedUser = await UserService.updateAccount(username, req.body);
      return res.status(200).json({ updatedUser });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const users = await UserService.getAll(req.query.search);
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  },

  getUsersOfGroup: async (req, res, next) => {
    try {
      const { MaNhom } = req.params;
      const users = await UserService.getUsersOfGroup(MaNhom);
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { UserController };
