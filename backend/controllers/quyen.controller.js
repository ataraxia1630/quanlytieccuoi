const { PermissionService } = require('../services/quyen.service');

const PermissionController = {
  getPerOfUser: async (req, res, next) => {
    try {
      const { username } = req.user;
      const permissions = await PermissionService.getPerOfUser(username);
      return res.status(200).json({ permissions });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { PermissionController };
