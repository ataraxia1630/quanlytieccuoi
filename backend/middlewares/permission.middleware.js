const { PermissionService } = require('../services/quyen.service');
const ApiError = require('../utils/apiError');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const username = req.user.username;
      const permissions = await PermissionService.getPerOfUser(username);

      if (!permissions.includes(requiredPermission)) {
        throw new ApiError(403, 'Bạn không có quyền thực hiện hành động này');
      }

      next();
    } catch (error) {
      return res.status(403).json({ error: error.message || 'Lỗi server' });
    }
  };
};

module.exports = { checkPermission };
